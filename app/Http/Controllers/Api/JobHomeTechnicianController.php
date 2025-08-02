<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobHomeTechnician;
use Illuminate\Support\Facades\Validator;

class JobHomeTechnicianController extends Controller
{
    // Assign multiple technicians to a jobhome
    public function assignTechnicians(Request $request, $jobhomeId)
    {
        $validator = Validator::make($request->all(), [
            'technicians' => 'required|array',
            'technicians.*.user_id' => 'required|exists:users,id',
            'technicians.*.technician_name' => 'required|string',
            'technicians.*.assign_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Delete existing assignments for this jobhome
        JobHomeTechnician::where('jobhome_id', $jobhomeId)->delete();

        // Create new assignments
        foreach ($request->technicians as $tech) {
            JobHomeTechnician::create([
                'jobhome_id' => $jobhomeId,
                'user_id' => $tech['user_id'],
                'technician_name' => $tech['technician_name'],
                'assign_date' => $tech['assign_date'],
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Technicians assigned successfully',
        ]);
    }

    // Get technicians assigned to a jobhome
    public function getAssignedTechnicians($jobhomeId)
    {
        $assigned = JobHomeTechnician::where('jobhome_id', $jobhomeId)->get();
        return response()->json($assigned);
    }
}
