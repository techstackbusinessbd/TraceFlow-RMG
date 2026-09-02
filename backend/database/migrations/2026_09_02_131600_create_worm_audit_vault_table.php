<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_vault_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('emp_id', 30)->nullable()->index();
            $table->string('action', 50)->index(); // CREATE, UPDATE, DELETE, PERMANENT_PURGE, LOGIN
            $table->string('entity_type', 100)->index(); // Table or Domain model
            $table->string('entity_id', 100)->index();
            $table->jsonb('old_values')->nullable();
            $table->jsonb('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestampTz('created_at')->useCurrent()->index();
        });

        // WORM (Write Once, Read Many) Append-Only Immutability Rule
        // Prevent UPDATE or DELETE on audit_vault_logs via PostgreSQL trigger
        DB::unprepared("
            CREATE OR REPLACE FUNCTION prevent_audit_vault_mutation()
            RETURNS TRIGGER AS $$
            BEGIN
                RAISE EXCEPTION 'WORM Security Violation: Records in audit_vault_logs are immutable and cannot be updated or deleted!';
            END;
            $$ LANGUAGE plpgsql;

            CREATE OR REPLACE TRIGGER trg_audit_vault_immutable
            BEFORE UPDATE OR DELETE ON audit_vault_logs
            FOR EACH ROW
            EXECUTE FUNCTION prevent_audit_vault_mutation();
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("
            DROP TRIGGER IF EXISTS trg_audit_vault_immutable ON audit_vault_logs;
            DROP FUNCTION IF EXISTS prevent_audit_vault_mutation();
        ");
        Schema::dropIfExists('audit_vault_logs');
    }
};
