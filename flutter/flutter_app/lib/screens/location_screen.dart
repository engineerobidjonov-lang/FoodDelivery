import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import '../providers/location_provider.dart';
import '../providers/auth_store.dart';
import '../services/api_service.dart';
import '../utils/styles.dart';

class LocationScreen extends StatefulWidget {
  const LocationScreen({super.key});

  @override
  State<LocationScreen> createState() => _LocationScreenState();
}

class _LocationScreenState extends State<LocationScreen> {
  final TextEditingController _addressController = TextEditingController();
  List<dynamic> _savedAddresses = [];
  bool _isLoading = false;
  String _estimate = '25-35 minutes';

  @override
  void initState() {
    super.initState();
    _loadAddresses();
  }

  Future<void> _loadAddresses() async {
    try {
      final auth = Provider.of<AuthStore>(context, listen: false);
      if (auth.token == null) return;
      final addresses = await ApiService.fetchAddresses(auth.token!);
      setState(() => _savedAddresses = addresses);
    } catch (e) {
      debugPrint('Error loading addresses: $e');
    }
  }

  Future<void> _detectLocation() async {
    setState(() => _isLoading = true);
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));
      _addressController.text = '742 Market Street, San Francisco, CA';
      setState(() => _estimate = '15-20 minutes');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final locationData = Provider.of<LocationProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: const Text('Set delivery address'),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1200),
          child: LayoutBuilder(
            builder: (context, constraints) {
              bool isDesktop = constraints.maxWidth > 900;

              Widget addressForm = SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: AppBorderRadius.section, boxShadow: [AppShadows.float]),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('DELIVERY LOCATION', style: TextStyle(color: AppColors.coral, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 2)),
                          const SizedBox(height: 12),
                          const Text('Set your address', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.slate900)),
                          const SizedBox(height: 12),
                          const Text('Enter a delivery address manually or use the mock location detector.', style: TextStyle(color: AppColors.slate500)),
                          
                          if (_savedAddresses.isNotEmpty) ...[
                            const SizedBox(height: 32),
                            const Text('SAVED ADDRESSES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.slate500, letterSpacing: 1.5)),
                            const SizedBox(height: 12),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: _savedAddresses.map((addr) => ActionChip(
                                label: Text('${addr['label']}: ${addr['street']}'),
                                backgroundColor: AppColors.cream,
                                side: BorderSide(color: AppColors.coral.withOpacity(0.1)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                onPressed: () => _addressController.text = '${addr['street']}, ${addr['city']}, ${addr['region']}',
                              )).toList(),
                            ),
                          ],

                          const SizedBox(height: 32),
                          TextField(
                            controller: _addressController,
                            decoration: InputDecoration(
                              labelText: 'Address',
                              hintText: 'Street, City, Region, Zip...',
                              filled: true,
                              fillColor: AppColors.cream,
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                            ),
                          ),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: _isLoading ? null : _detectLocation,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.slate900,
                                    foregroundColor: Colors.white,
                                    minimumSize: const Size(0, 56),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  ),
                                  child: _isLoading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Detect Location'),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () {},
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: AppColors.slate900,
                                    side: const BorderSide(color: AppColors.sand),
                                    minimumSize: const Size(0, 56),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  ),
                                  child: const Text('Save Address'),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(24)),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('ESTIMATED DELIVERY TIME', style: TextStyle(color: AppColors.coral, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 1.5)),
                                const SizedBox(height: 8),
                                Text(_estimate, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.slate900)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );

              Widget mapPreview = Container(
                margin: isDesktop ? const EdgeInsets.all(24) : EdgeInsets.zero,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: isDesktop ? AppBorderRadius.section : BorderRadius.zero,
                  boxShadow: isDesktop ? [AppShadows.float] : null,
                ),
                child: Column(
                  children: [
                    if (isDesktop) Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('MAP PREVIEW', style: TextStyle(color: AppColors.coral, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 1.5)),
                              Text('Real-time tracking', style: TextStyle(color: AppColors.slate500, fontSize: 13)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(color: AppColors.cream, borderRadius: BorderRadius.circular(100)),
                            child: const Text('Active route', style: TextStyle(color: AppColors.coral, fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: ClipRRect(
                        borderRadius: isDesktop ? const BorderRadius.vertical(bottom: Radius.circular(32)) : BorderRadius.zero,
                        child: GoogleMap(
                          initialCameraPosition: CameraPosition(target: locationData.deliveryPosition, zoom: 15),
                          markers: {
                            Marker(markerId: const MarkerId('pos'), position: locationData.deliveryPosition, icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange)),
                          },
                          myLocationButtonEnabled: false,
                          zoomControlsEnabled: false,
                        ),
                      ),
                    ),
                  ],
                ),
              );

              if (isDesktop) {
                return Row(
                  children: [
                    Expanded(flex: 1, child: addressForm),
                    Expanded(flex: 1, child: mapPreview),
                  ],
                );
              } else {
                return ListView(
                  children: [
                    addressForm,
                    SizedBox(height: 400, child: mapPreview),
                    const SizedBox(height: 24),
                  ],
                );
              }
            },
          ),
        ),
      ),
    );
  }
}
