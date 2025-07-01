<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $primaryKey = 'area_id';

    protected $fillable = [
        'area_name',
    ];

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'area_branch', 'area_id', 'branch_id');
    }

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_area', 'area_id', 'customer_id');
    }
}
