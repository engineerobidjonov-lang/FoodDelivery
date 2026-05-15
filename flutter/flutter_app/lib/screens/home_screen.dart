import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/food.dart';
import '../models/category.dart';
import '../providers/cart_store.dart';
import '../providers/auth_store.dart';
import '../utils/styles.dart';
import '../widgets/food_card.dart';
import 'category_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<Category>> _categoriesFuture;
  late Future<List<Food>> _foodsFuture;

  @override
  void initState() {
    super.initState();
    _categoriesFuture = ApiService.fetchCategories();
    _foodsFuture = ApiService.fetchFoods();
  }

  List<Food> getFoodsByCategory(List<Food> foods, String categoryName) {
    return foods.where((food) => food.category.toLowerCase() == categoryName.toLowerCase()).toList();
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthStore>(context);

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: Colors.white.withOpacity(0.8),
        surfaceTintColor: Colors.transparent,
        title: Row(
          children: [
            Container(
              height: 40,
              width: 40,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: AppGradients.hero,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(color: AppColors.coral.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4))
                ],
              ),
              child: const Text('FD', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16)),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('FoodDash', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.slate900)),
                Text('CUSTOMER UI', style: TextStyle(fontSize: 10, letterSpacing: 2, color: AppColors.slate500)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(Icons.location_on_outlined), onPressed: () => Navigator.pushNamed(context, '/location')),
          Stack(
            children: [
              IconButton(icon: const Icon(Icons.shopping_cart_outlined), onPressed: () => Navigator.pushNamed(context, '/cart')),
              Positioned(
                right: 4,
                top: 4,
                child: Consumer<CartStore>(
                  builder: (ctx, cart, _) => Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: AppColors.coral, shape: BoxShape.circle),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    child: Text('${cart.itemCount}', style: const TextStyle(fontSize: 8, color: Colors.white, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                  ),
                ),
              ),
            ],
          ),
          IconButton(icon: const Icon(Icons.logout), onPressed: () => auth.logout()),
          const SizedBox(width: 8),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1200),
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hero Section
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    gradient: AppGradients.hero,
                    borderRadius: AppBorderRadius.section,
                    boxShadow: [AppShadows.float],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(100),
                          border: Border.all(color: Colors.white.withOpacity(0.2)),
                        ),
                        child: const Text(
                          'FAST CUSTOMER ORDERING',
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Discover bold flavors and order your next meal in minutes.',
                        style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w900, height: 1.1),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Browse curated dishes across traditional, seafood, and fast food menus.',
                        style: TextStyle(color: Colors.white70, fontSize: 16),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),

                // Categories Row
                FutureBuilder<List<Category>>(
                  future: _categoriesFuture,
                  builder: (ctx, snapshot) {
                    if (!snapshot.hasData) return const SizedBox();
                    final categories = snapshot.data!;
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 20),
                          child: Text('Explore Categories', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.slate900)),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          height: 100,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: categories.length,
                            itemBuilder: (ctx, i) => GestureDetector(
                              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (ctx) => CategoryScreen(category: categories[i]))),
                              child: Container(
                                width: 160,
                                margin: const EdgeInsets.only(right: 12),
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: AppColors.coral.withOpacity(0.2)),
                                  gradient: LinearGradient(colors: [Colors.white, AppColors.cream.withOpacity(0.5)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(categories[i].name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.coral)),
                                    const SizedBox(height: 4),
                                    Text(categories[i].subtitle, style: const TextStyle(fontSize: 10, color: AppColors.slate500), maxLines: 2, overflow: TextOverflow.ellipsis),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 40),

                // Featured Foods Grouped by Category
                FutureBuilder<List<Food>>(
                  future: _foodsFuture,
                  builder: (ctx, foodsSnapshot) {
                    if (!foodsSnapshot.hasData) return const Center(child: CircularProgressIndicator());
                    final allFoods = foodsSnapshot.data!;

                    return FutureBuilder<List<Category>>(
                      future: _categoriesFuture,
                      builder: (ctx, catsSnapshot) {
                        if (!catsSnapshot.hasData) return const SizedBox();
                        final categories = catsSnapshot.data!;

                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: categories.length,
                          itemBuilder: (ctx, i) {
                            final catFoods = getFoodsByCategory(allFoods, categories[i].name);
                            if (catFoods.isEmpty) return const SizedBox();

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 40),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 20),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(categories[i].name.toUpperCase(), style: const TextStyle(color: AppColors.coral, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 2)),
                                              const SizedBox(height: 4),
                                              Text(categories[i].subtitle, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.slate900)),
                                            ],
                                          ),
                                        ),
                                        TextButton(
                                          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (ctx) => CategoryScreen(category: categories[i]))),
                                          style: TextButton.styleFrom(
                                            foregroundColor: AppColors.slate700,
                                            side: BorderSide(color: AppColors.coral.withOpacity(0.2)),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
                                          ),
                                          child: const Text('View all'),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 20),
                                  SizedBox(
                                    height: 280,
                                    child: ListView.builder(
                                      scrollDirection: Axis.horizontal,
                                      padding: const EdgeInsets.symmetric(horizontal: 16),
                                      itemCount: catFoods.length.clamp(0, 5),
                                      itemBuilder: (ctx, j) => Container(
                                        width: 240,
                                        margin: const EdgeInsets.only(right: 16),
                                        child: FoodCard(food: catFoods[j]),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        );
                      },
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
