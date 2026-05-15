import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_store.dart';
import 'providers/cart_store.dart';
import 'providers/location_provider.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/location_screen.dart';
import 'utils/styles.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthStore()),
        ChangeNotifierProvider(create: (_) => CartStore()),
        ChangeNotifierProvider(create: (_) => LocationProvider()),
      ],
      child: const FoodDashApp(),
    ),
  );
}

class FoodDashApp extends StatelessWidget {
  const FoodDashApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FoodDash',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Segoe UI',
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.coral,
          primary: AppColors.coral,
          secondary: AppColors.slate900,
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: AppColors.cream,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 0,
          scrolledUnderElevation: 0,
          titleTextStyle: TextStyle(
            color: AppColors.slate900,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: IconThemeData(color: AppColors.slate900),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            padding: const EdgeInsets.symmetric(vertical: 16),
          ),
        ),
      ),
      home: Consumer<AuthStore>(
        builder: (ctx, auth, _) => auth.isAuthenticated ? const HomeScreen() : const LoginScreen(),
      ),
      routes: {
        '/home': (ctx) => const HomeScreen(),
        '/cart': (ctx) => const CartScreen(),
        '/location': (ctx) => const LocationScreen(),
      },
    );
  }
}
