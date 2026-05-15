import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;
// ignore: unused_import
import 'dart:io' show Platform;
import '../models/food.dart';
import '../models/category.dart';

class ApiService {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }
    // For Android Emulator, use 10.0.2.2.
    // For iOS Simulator or physical devices, use your local IP.
    return 'http://10.0.2.2:5000/api';
  }

  static Map<String, String> _headers(String? token) {
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<List<Category>> fetchCategories() async {
    final response = await http.get(Uri.parse('$baseUrl/categories'));
    if (response.statusCode == 200) {
      List data = json.decode(response.body);
      return data.map((json) => Category.fromJson(json)).toList();
    }
    throw Exception('Failed to load categories');
  }

  static Future<List<Food>> fetchFoods() async {
    final response = await http.get(Uri.parse('$baseUrl/foods'));
    if (response.statusCode == 200) {
      List data = json.decode(response.body);
      return data.map((json) => Food.fromJson(json)).toList();
    }
    throw Exception('Failed to load foods');
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _headers(null),
        body: json.encode({'email': email.trim(), 'password': password.trim()}),
      ).timeout(const Duration(seconds: 5));
      
      return json.decode(response.body);
    } catch (e) {
      return {'error': {'message': 'Connection error. Is the server running at $baseUrl?'}};
    }
  }

  static Future<Map<String, dynamic>> fetchSellerContact(String foodId) async {
    final response = await http.get(Uri.parse('$baseUrl/foods/$foodId/contact'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    throw Exception('Failed to load contact info');
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: _headers(null),
        body: json.encode({
          'name': name.trim(),
          'email': email.trim(),
          'password': password.trim(),
        }),
      ).timeout(const Duration(seconds: 5));
      return json.decode(response.body);
    } catch (e) {
      return {'error': {'message': 'Connection error'}};
    }
  }

  static Future<List<dynamic>> fetchAddresses(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/addresses'),
      headers: _headers(token),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    throw Exception('Failed to load addresses');
  }

  static Future<Map<String, dynamic>> saveAddress(String token, Map<String, dynamic> payload) async {
    final response = await http.post(
      Uri.parse('$baseUrl/addresses'),
      headers: _headers(token),
      body: json.encode(payload),
    );
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> fetchDeliveryEstimate(String addressId) async {
    final response = await http.get(Uri.parse('$baseUrl/estimate/$addressId'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    throw Exception('Failed to fetch estimate');
  }

  static Future<Map<String, dynamic>> createOrder(String token, List<Map<String, dynamic>> items, Map<String, dynamic> address) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orders/create'),
      headers: _headers(token),
      body: json.encode({
        'items': items,
        'address': address,
      }),
    );
    return json.decode(response.body);
  }
}
