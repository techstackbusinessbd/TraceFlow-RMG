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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedSmallInteger('failed_login_attempts')->default(0)->after('last_login_ip');
            $table->timestamp('locked_at')->nullable()->after('failed_login_attempts');
            $table->timestamp('locked_until')->nullable()->after('locked_at');
            $table->timestamp('unlocked_at')->nullable()->after('locked_until');
            $table->uuid('unlocked_by')->nullable()->after('unlocked_at');

            $table->index(['locked_at', 'locked_until']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['locked_at', 'locked_until']);
            $table->dropColumn([
                'failed_login_attempts',
                'locked_at',
                'locked_until',
                'unlocked_at',
                'unlocked_by',
            ]);
        });
    }
};
