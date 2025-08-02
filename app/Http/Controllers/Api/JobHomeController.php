<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobHome;
use App\Models\JobCard;

class JobHomeController extends Controller
{
     // Create JobHome with auto-generated job_no
    public function store(Request $request)
        {
            $request->validate([
                'job_type' => 'required|string',
                'customer_id' => 'nullable|exists:customers,customer_id',
                'job_status' => 'nullable|string',
            ]);

            $jobType = trim($request->job_type); // remove extra whitespace

            // 🔠 Use first two letters of job_type as prefix (uppercase)
            $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $jobType), 0, 2));

            // 🔍 Find the latest job_no with this prefix
            $lastJob = JobHome::where('job_no', 'LIKE', $prefix . '%')
                        ->orderBy('id', 'desc')
                        ->first();

            if ($lastJob) {
                // Get numeric part from job_no (e.g., 00012 from GE00012)
                $lastNumber = (int) substr($lastJob->job_no, strlen($prefix));
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            // 🆕 Generate the new job number
            $jobNo = $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

            // 📌 Default status if not provided
            $status = $request->job_status ?? 'Pending ';

            $jobHome = JobHome::create([
                'job_no' => $jobNo,
                'job_type' => $jobType,
                'customer_id' => $request->customer_id,
                'job_status' => $status,
            ]);

            return response()->json([
                'job_home' => $jobHome,
                'job_card' => null,
            ]);
        }



    // Update fields like service_start, service_end etc.
    public function update(Request $request, $id)
    {
        $request->validate([
            'service_start' => 'nullable|boolean',
            'service_end' => 'nullable|boolean',
            'customer_ok' => 'nullable|boolean',
            'special_approve' => 'nullable|boolean',
            'customer_id' => 'nullable|exists:customers,customer_id',
            'job_status' => 'nullable|string',
        ]);

        $jobHome = JobHome::findOrFail($id);
        $jobHome->update($request->only(['service_start', 'service_end', 'customer_ok', 'special_approve', 'customer_id', 'job_status']));
        return response()->json($jobHome);
    }

    // Optional: Fetch single job home with job card
    public function show($id)
    {
        $jobHome = JobHome::with('jobCard')->findOrFail($id);
        return response()->json([
            'job_home' => $jobHome,
            'job_card' => $jobHome->jobCard
        ]);
    }
       public function index()
    {
        return JobHome::with('jobCard')->get();
    }
}
