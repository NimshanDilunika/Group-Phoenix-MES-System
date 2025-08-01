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
        Schema::create('job_items', function (Blueprint $table) {
              $table->id();
              $table->foreignId('job_home_id')->constrained()->onDelete('cascade');
              $table->string('materials_no')->nullable();
              $table->string('materials')->nullable();
              $table->integer('quantity')->nullable();
              $table->decimal('unit_price', 10, 2)->nullable();
              $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_items');
    }
};
