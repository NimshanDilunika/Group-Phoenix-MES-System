<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobCard extends Model
{
     protected $fillable = [
        'job_home_id',
        'selected_date',
        'customer_name', 
        'fam_no', 
        'contact_person',
        'area', 
        'contact_number',
        'branch_sc',
        'generator_make', 
        'kva',
        'engine_make', 
        'last_service', 
        'alternator_make', 
        'gen_model',
        'controller_module', 
        'avr', 'ats_info', 
        'job_description', 
        'filters',
    ];

    protected $casts = [
        'filters' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(JobItem::class);
    }
     public function jobHome()
    {
        return $this->belongsTo(JobHome::class);
    }
}
