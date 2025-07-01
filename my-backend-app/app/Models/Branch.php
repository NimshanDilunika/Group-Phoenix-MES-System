<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $primaryKey = 'branch_id';

    protected $fillable = [
        'branch_name',
        'branch_phoneno',
    ];

    public function areas()
    {
        return $this->belongsToMany(Area::class, 'area_branch', 'branch_id', 'area_id');
    }
}
