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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fullname');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            
            // Consider making 'idnumber' nullable if not every user will have one,
            // and remove unique() if it's not strictly unique for all users.
            $table->string('idnumber')->unique(); 
            
            // It's generally safer to use string for phone numbers to allow for
            // international formats, dashes, or other characters.
            $table->integer('phoneno'); 

            // THIS LINE IS ALREADY CORRECTLY UPDATED WITH THE NEW ROLES:
            $table->enum('role', ['Administrator','Tecnical_Head', ' ', 'Technician'])->default('Technician');

            // --- ADD THESE NEW COLUMNS FOR PROFILE IMAGE ---
            $table->longText('profile_image')->nullable(); // For base64 encoded image data
            $table->string('profile_image_mime')->nullable(); // For image MIME type (e.g., 'image/jpeg')
            // -----------------------------------------------

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
