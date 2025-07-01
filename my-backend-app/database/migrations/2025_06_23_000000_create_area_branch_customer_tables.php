<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAreaBranchCustomerTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. Create branches table
        Schema::create('branches', function (Blueprint $table) {
            $table->increments('branch_id');
            $table->string('branch_name', 100);
            $table->string('branch_phoneno', 100)->nullable();
            $table->timestamps();
        });

        // 2. Create areas table
        Schema::create('areas', function (Blueprint $table) {
            $table->increments('area_id');
            $table->string('area_name', 100);
            $table->timestamps();
        });

        // 3. Create customers table
        Schema::create('customers', function (Blueprint $table) {
            $table->increments('customer_id');
            $table->string('customer_name', 100);
            $table->string('email', 100)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('address', 50)->nullable();
            $table->timestamps();
        });

        // 4. Pivot: area_branch (area_id + branch_id)
        Schema::create('area_branch', function (Blueprint $table) {
            $table->unsignedInteger('area_id');
            $table->unsignedInteger('branch_id');

            // Foreign keys
            $table->foreign('area_id')
                ->references('area_id')->on('areas')
                ->onDelete('cascade');

            $table->foreign('branch_id')
                ->references('branch_id')->on('branches')
                ->onDelete('cascade');

            // Composite primary key
            $table->primary(['area_id', 'branch_id']);
        });

        // 5. Pivot: customer_area (customer_id + area_id)
        Schema::create('customer_area', function (Blueprint $table) {
            $table->unsignedInteger('customer_id');
            $table->unsignedInteger('area_id');

            // Foreign keys
            $table->foreign('customer_id')
                ->references('customer_id')->on('customers')
                ->onDelete('cascade');

            $table->foreign('area_id')
                ->references('area_id')->on('areas')
                ->onDelete('cascade');

            // Composite primary key
            $table->primary(['customer_id', 'area_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop pivot tables first to avoid constraint conflicts
        Schema::dropIfExists('customer_area');
        Schema::dropIfExists('area_branch');

        // Drop main tables
        Schema::dropIfExists('customers');
        Schema::dropIfExists('areas');
        Schema::dropIfExists('branches');
    }
}
