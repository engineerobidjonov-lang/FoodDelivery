import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_store.dart';
import '../providers/auth_store.dart';
import '../services/api_service.dart';
import '../utils/styles.dart';
import '../widgets/cart_item.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  bool _isPlacingOrder = false;

  void _showSellerContact(BuildContext context, String foodId) async {
    try {
      final contact = await ApiService.fetchSellerContact(foodId);
      if (!context.mounted) return;

      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
          title: const Text('Seller Contact', style: TextStyle(fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Seller for ${contact['foodName']}', style: const TextStyle(color: AppColors.coral, fontWeight: FontWeight.bold, fontSize: 12)),
              const SizedBox(height: 8),
              Text(contact['seller'], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(16)),
                child: Row(
                  children: [
                    const Icon(Icons.phone, color: AppColors.coral),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Official Number', style: TextStyle(fontSize: 10, color: AppColors.slate500)),
                        Text(contact['phone'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
          ],
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Could not fetch seller info')));
    }
  }

  void _handleCheckout(CartStore cart) async {
    final auth = Provider.of<AuthStore>(context, listen: false);
    if (!auth.isAuthenticated) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please login to place an order')));
      Navigator.pushNamed(context, '/login');
      return;
    }

    setState(() => _isPlacingOrder = true);
    try {
      final items = cart.items.values.map((item) => {
        'foodId': item.food.id,
        'quantity': item.quantity
      }).toList();

      final address = {
        'street': '742 Market Street',
        'city': 'San Francisco',
        'region': 'CA',
        'postalCode': '94103'
      };

      final result = await ApiService.createOrder(auth.token!, items, address);
      
      if (!mounted) return;

      if (result['error'] != null) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['error']['message'] ?? 'Failed to place order')));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order placed successfully!')));
        cart.clear();
        Navigator.pushReplacementNamed(context, '/home');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('An error occurred while placing order')));
      }
    } finally {
      if (mounted) setState(() => _isPlacingOrder = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartStore>(context);
    final items = cart.items.values.toList();
    const double deliveryFee = 4.0;

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: const Text('Review your order'),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1200),
          child: LayoutBuilder(
            builder: (context, constraints) {
              bool isDesktop = constraints.maxWidth > 900;
              
              Widget cartList = ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: items.isEmpty ? 1 : items.length,
                itemBuilder: (ctx, i) {
                  if (items.isEmpty) {
                    return Container(
                      margin: const EdgeInsets.only(top: 100),
                      padding: const EdgeInsets.all(40),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32), boxShadow: [AppShadows.float]),
                      child: const Column(
                        children: [
                          Icon(Icons.shopping_basket_outlined, size: 64, color: AppColors.sand),
                          SizedBox(height: 20),
                          Text('Your cart is empty', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                          SizedBox(height: 8),
                          Text('Add meals from any category to start building your order.', textAlign: TextAlign.center, style: TextStyle(color: AppColors.slate500)),
                        ],
                      ),
                    );
                  }
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: CartItemWidget(food: items[i].food, quantity: items[i].quantity),
                  );
                },
              );

              Widget summary = Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: AppColors.slate900,
                  borderRadius: isDesktop ? BorderRadius.circular(32) : const BorderRadius.vertical(top: Radius.circular(32)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Row(children: [Text('ORDER SUMMARY', style: TextStyle(color: AppColors.sand, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 2))]),
                    const SizedBox(height: 24),
                    _summaryRow('Items', '${cart.itemCount}'),
                    _summaryRow('Subtotal', '\$${cart.totalAmount.toStringAsFixed(2)}'),
                    _summaryRow('Delivery fee', '\$${items.isEmpty ? '0.00' : deliveryFee.toStringAsFixed(2)}'),
                    const Padding(padding: EdgeInsets.symmetric(vertical: 20), child: Divider(color: Colors.white10)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total', style: TextStyle(color: Colors.white70, fontSize: 18)),
                        Text('\$${(cart.totalAmount + (items.isEmpty ? 0 : deliveryFee)).toStringAsFixed(2)}', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
                      ],
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      onPressed: (items.isEmpty || _isPlacingOrder) ? null : () => _handleCheckout(cart),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.coral,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 60),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        elevation: 0,
                      ),
                      child: _isPlacingOrder 
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Checkout', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      onPressed: items.isEmpty ? null : () => _showSellerContact(context, items[0].food.id),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: Colors.white24),
                        minimumSize: const Size(double.infinity, 60),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      child: const Text('Call Seller', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 20),
                    const Text('Checkout and calling are integrated with the backend API.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white30, fontSize: 11)),
                  ],
                ),
              );

              if (isDesktop) {
                return Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(flex: 3, child: cartList),
                      const SizedBox(width: 24),
                      Expanded(flex: 2, child: summary),
                    ],
                  ),
                );
              } else {
                return Column(
                  children: [
                    Expanded(child: cartList),
                    summary,
                  ],
                );
              }
            },
          ),
        ),
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white60, fontSize: 15)),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }
}
