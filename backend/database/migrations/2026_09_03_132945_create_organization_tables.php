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
        // 1. Group Organization (Top Level Global Profile)
        Schema::create('organizations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->string('code', 50)->unique();
            $table->string('registration_no', 100)->nullable();
            $table->string('logo_path')->nullable();
            $table->text('address')->nullable();
            $table->string('country', 100)->default('Bangladesh');
            $table->string('contact_email', 150)->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->string('website', 150)->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Sister Companies / Legal Entities (Multi-Entity / NBR Tax Units)
        Schema::create('companies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 50);
            $table->string('bin_number', 50)->nullable(); // NBR Business Identification Number
            $table->string('tin_number', 50)->nullable(); // Tax Identification Number
            $table->string('trade_license', 100)->nullable();
            $table->text('registered_address')->nullable();
            $table->string('contact_email', 150)->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->string('currency', 10)->default('USD');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'code']);
        });

        // 3. Factory Plants / Units (Physical Manufacturing Facilities)
        Schema::create('factory_units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 50);
            $table->string('premises_type', 50)->default('Woven'); // Woven, Knit, Denim, Washing, Composite
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->integer('total_floors')->default(1);
            $table->string('compliance_grade', 20)->nullable(); // A, B, Green, Platinum
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['company_id', 'code']);
        });

        // 4. Production Lines / Floor Sections (Lines, Cutting Tables, Finishing Gates)
        Schema::create('production_lines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('factory_unit_id')->constrained('factory_units')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 50);
            $table->string('section_type', 50)->default('Sewing'); // Sewing, Cutting, Finishing, Washing, QC
            $table->string('floor_no', 50)->default('1st Floor');
            $table->integer('operator_capacity')->default(0);
            $table->decimal('target_efficiency_percentage', 5, 2)->default(100.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['factory_unit_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_lines');
        Schema::dropIfExists('factory_units');
        Schema::dropIfExists('companies');
        Schema::dropIfExists('organizations');
    }
};
