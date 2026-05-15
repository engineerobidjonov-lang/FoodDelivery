import 'package:flutter/material.dart';

class AppColors {
  static const Color ink = Color(0xFF1F2937);
  static const Color coral = Color(0xFFF97316);
  static const Color cream = Color(0xFFFFF7ED);
  static const Color sand = Color(0xFFFED7AA);
  static const Color slate500 = Color(0xFF64748B);
  static const Color slate700 = Color(0xFF334155);
  static const Color slate900 = Color(0xFF0F172A);
}

class AppGradients {
  static const LinearGradient hero = LinearGradient(
    colors: [Color(0xFFF97316), Color(0xFFFBBF24)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

class AppShadows {
  static final BoxShadow float = BoxShadow(
    color: Colors.black.withOpacity(0.28),
    blurRadius: 45,
    offset: const Offset(0, 18),
    spreadRadius: -18,
  );
}

class AppBorderRadius {
  static final BorderRadius section = BorderRadius.circular(32);
  static final BorderRadius card = BorderRadius.circular(24);
  static final BorderRadius button = BorderRadius.circular(16);
}
