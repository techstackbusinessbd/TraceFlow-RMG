<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('device_code', 50)->unique();
            $table->string('device_name', 120);
            $table->string('device_type', 50)->default('TABLET'); // TABLET, BARCODE_TERMINAL, RFID_SCANNER, WORKSTATION
            $table->string('assigned_location', 150);
            $table->string('mac_address', 50)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('pairing_status', 30)->default('PAIRED'); // PAIRED, PENDING, REVOKED
            $table->boolean('is_active')->default(true);
            $table->timestampTz('last_ping_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
