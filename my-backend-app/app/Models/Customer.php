<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Customer extends Model
{
    use HasFactory;

    protected $primaryKey = 'customer_id';

    protected $fillable = [
        'customer_name',
        'email',
        'phone',
        'address',
    ];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($customer) {
            $areas = $customer->areas()->get();

            // Detach area links
            $customer->areas()->detach();

            foreach ($areas as $area) {
                // If no other customers linked, delete area
                if ($area->customers()->count() === 0) {
                    $branches = $area->branches()->get();

                    // Detach area-branch links
                    $area->branches()->detach();

                    // Delete area
                    $area->delete();

                    // Delete branches if no other areas are using them
                    foreach ($branches as $branch) {
                        if ($branch->areas()->count() === 0) {
                            $branch->delete();
                        }
                    }
                }
            }
        });
    }

    public function areas(): BelongsToMany
    {
        return $this->belongsToMany(Area::class, 'customer_area', 'customer_id', 'area_id');
    }
}
