<?php

namespace Database\Seeders;

use App\Models\Device;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = [
            [
                'device_code' => 'DEV-TAB-CUT-01',
                'device_name' => 'Cutting Table #1 Tablet',
                'device_type' => 'TABLET',
                'assigned_location' => 'Building 1 - Cutting Section Hall A',
                'mac_address' => '4A:2B:CC:81:90:12',
                'serial_number' => 'SN-TAB-CUT-9012',
                'ip_address' => '192.168.10.101',
                'pairing_status' => 'PAIRED',
                'is_active' => true,
                'last_ping_at' => Carbon::now()->subMinutes(2),
            ],
            [
                'device_code' => 'DEV-TERM-SEW-L01',
                'device_name' => 'Sewing Line 1 End-of-Line QC Terminal',
                'device_type' => 'BARCODE_TERMINAL',
                'assigned_location' => 'Building 2 - Floor 1 - Line 01',
                'mac_address' => '5C:11:DA:44:22:98',
                'serial_number' => 'SN-QC-LINE1-2298',
                'ip_address' => '192.168.10.115',
                'pairing_status' => 'PAIRED',
                'is_active' => true,
                'last_ping_at' => Carbon::now()->subSeconds(45),
            ],
            [
                'device_code' => 'DEV-TAB-SEW-L02',
                'device_name' => 'Sewing Line 2 Supervisor Tablet',
                'device_type' => 'TABLET',
                'assigned_location' => 'Building 2 - Floor 1 - Line 02',
                'mac_address' => '6E:33:FF:12:00:55',
                'serial_number' => 'SN-SUP-LINE2-0055',
                'ip_address' => '192.168.10.120',
                'pairing_status' => 'PAIRED',
                'is_active' => true,
                'last_ping_at' => Carbon::now()->subMinutes(12),
            ],
            [
                'device_code' => 'DEV-SCAN-FIN-01',
                'device_name' => 'Finishing & Packing Barcode Scanner',
                'device_type' => 'BARCODE_TERMINAL',
                'assigned_location' => 'Building 1 - Finishing Floor East',
                'mac_address' => '7B:44:EE:99:31:04',
                'serial_number' => 'SN-SCAN-FIN-3104',
                'ip_address' => '192.168.10.150',
                'pairing_status' => 'PAIRED',
                'is_active' => true,
                'last_ping_at' => Carbon::now()->subMinutes(5),
            ],
            [
                'device_code' => 'DEV-RFID-WH-01',
                'device_name' => 'Warehouse Master RFID Handheld Gun',
                'device_type' => 'RFID_SCANNER',
                'assigned_location' => 'Central Fabric Warehouse Bay 4',
                'mac_address' => '8A:99:11:23:77:88',
                'serial_number' => 'SN-RFID-WH-7788',
                'ip_address' => '192.168.10.201',
                'pairing_status' => 'PENDING',
                'is_active' => false,
                'last_ping_at' => Carbon::now()->subHours(2),
            ],
        ];

        foreach ($devices as $d) {
            Device::updateOrCreate(
                ['device_code' => $d['device_code']],
                $d
            );
        }
    }
}
