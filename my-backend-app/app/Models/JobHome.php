<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobHome extends Model
{
    protected $fillable = ['job_no', 'job_type', 'job_status', 'service_start', 'service_end', 'customer_ok', 'special_approve', 'customer_id'];

    public function jobCard()
    {
        return $this->hasOne(JobCard::class);
    }

    public function customer()
    {
        return $this->belongsTo(\App\Models\Customer::class);
    }
}
