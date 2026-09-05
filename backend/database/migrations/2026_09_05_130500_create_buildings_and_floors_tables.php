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
        // 1. Factory Buildings Table
        Schema::create('buildings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('factory_unit_id')->constrained('factory_units')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 50);
            $table->integer('total_floors')->default(1);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['factory_unit_id', 'code']);
        });

        // 2. Building Floors Table (with sort_order for strict sequential display)
        Schema::create('floors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('building_id')->constrained('buildings')->cascadeOnDelete();
            $table->string('name', 150); // e.g. "3rd Floor - Sewing Section"
            $table->string('floor_number', 50); // e.g. "Ground Floor", "1st Floor", "2nd Floor"
            $table->string('code', 50); // e.g. "FL-01"
            $table->integer('sort_order')->default(1); // For strict vertical / display serial ordering
            $table->integer('area_sqft')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['building_id', 'code']);
        });

        // 3. Update production_lines Table to support building_id and floor_id
        Schema::table('production_lines', function (Blueprint $table) {
            $table->foreignUuid('building_id')->nullable()->after('factory_unit_id')->constrained('buildings')->nullOnDelete();
            $table->foreignUuid('floor_id')->nullable()->after('building_id')->constrained('floors')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('production_lines', function (Blueprint $table) {
            $table->dropForeign(['floor_id']);
            $table->dropForeign(['building_id']);
            $table->dropColumn(['floor_id', 'building_id']);
        });

        Schema::dropIfExists('floors');
        Schema::dropIfExists('buildings');
    }
};
