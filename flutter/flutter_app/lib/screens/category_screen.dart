import 'package:flutter/material.dart';
import '../models/category.dart';
import '../models/food.dart';
import '../services/api_service.dart';
import '../utils/styles.dart';
import '../widgets/food_card.dart';

class CategoryScreen extends StatefulWidget {
  final Category category;

  const CategoryScreen({super.key, required this.category});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  String _searchQuery = '';
  double _maxPrice = 30.0;
  late Future<List<Food>> _foodsFuture;

  @override
  void initState() {
    super.initState();
    _foodsFuture = ApiService.fetchFoods();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: Text(widget.category.name),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1200),
          child: Column(
            children: [
              // Header & Filters Section
              Container(
                width: double.infinity,
                margin: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: AppBorderRadius.section,
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))
                  ],
                ),
                child: Column(
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
                      child: Image.network(
                        widget.category.banner,
                        height: 200,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('CATEGORY MENU', style: TextStyle(color: AppColors.coral, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 2)),
                          const SizedBox(height: 8),
                          Text(widget.category.name, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.slate900)),
                          const SizedBox(height: 8),
                          Text(widget.category.subtitle, style: const TextStyle(color: AppColors.slate500, fontSize: 15)),
                          const SizedBox(height: 24),
                          LayoutBuilder(
                            builder: (context, constraints) {
                              bool isMobile = constraints.maxWidth < 600;
                              return Wrap(
                                spacing: 16,
                                runSpacing: 16,
                                children: [
                                  SizedBox(
                                    width: isMobile ? double.infinity : 300,
                                    child: TextField(
                                      decoration: InputDecoration(
                                        hintText: 'Search dishes...',
                                        prefixIcon: const Icon(Icons.search, color: AppColors.coral),
                                        filled: true,
                                        fillColor: AppColors.cream,
                                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                                      ),
                                      onChanged: (val) => setState(() => _searchQuery = val),
                                    ),
                                  ),
                                  SizedBox(
                                    width: isMobile ? double.infinity : 300,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(16)),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text('Max Price: \$${_maxPrice.toInt()}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                                          Slider(
                                            value: _maxPrice,
                                            min: 5,
                                            max: 40,
                                            activeColor: AppColors.coral,
                                            onChanged: (val) => setState(() => _maxPrice = val),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Items Grid
              Expanded(
                child: FutureBuilder<List<Food>>(
                  future: _foodsFuture,
                  builder: (ctx, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
                    if (!snapshot.hasData) return const Center(child: Text('No items found'));

                    final foods = snapshot.data!.where((food) {
                      final matchesCat = food.category.toLowerCase() == widget.category.name.toLowerCase();
                      final matchesSearch = food.name.toLowerCase().contains(_searchQuery.toLowerCase());
                      final matchesPrice = food.price <= _maxPrice;
                      return matchesCat && matchesSearch && matchesPrice;
                    }).toList();

                    return GridView.builder(
                      padding: const EdgeInsets.all(16),
                      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                        maxCrossAxisExtent: 300,
                        mainAxisExtent: 280,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: foods.length,
                      itemBuilder: (ctx, i) => FoodCard(food: foods[i]),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
