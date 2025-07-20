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
        ]);

        // Check for existing jobhome with the same job_type
        $existingJobHome = JobHome::where('job_type', $request->job_type)->first();

        if ($existingJobHome) {
            // Check if jobcard exists for this jobhome
            $existingJobCard = JobCard::where('job_home_id', $existingJobHome->id)->first();
            if (!$existingJobCard) {
                // Return existing jobhome if no jobcard assigned
                return response()->json([
                    'job_home' => $existingJobHome,
                    'job_card' => null,
                ]);
            }
        }

        // Generate new job_no
        $maxId = JobHome::max('id');
        $nextId = $maxId ? $maxId + 1 : 1;
        $jobNo = 'JOB' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        $jobHome = JobHome::create([
            'job_no' => $jobNo,
            'job_type' => $request->job_type,
            'customer_id' => $request->customer_id,
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
        ]);

        $jobHome = JobHome::findOrFail($id);
        $jobHome->update($request->only(['service_start', 'service_end', 'customer_ok', 'special_approve', 'customer_id']));
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
