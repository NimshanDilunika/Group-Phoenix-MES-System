<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobCard;
use App\Models\JobItem;

class JobCardController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Request data: ' . json_encode($request->all()));

        $validated = $request->validate([
            'job_home_id' => 'required|exists:job_homes,id',
            'selected_date' => 'required|date',
            'customer_name' => 'required|string',
            'customer_id' => 'nullable|exists:customers,id',
            'fam_no' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'area' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'branch_sc' => 'nullable|string',
            'generator_make' => 'nullable|string',
            'kva' => 'nullable|string',
            'engine_make' => 'nullable|string',
            'last_service' => 'nullable|string',
            'alternator_make' => 'nullable|string',
            'gen_model' => 'nullable|string',
            'controller_module' => 'nullable|string',
            'avr' => 'nullable|string',
            'ats_info' => 'nullable|string',
            'job_description' => 'nullable|string',
            'filters' => 'nullable|array',
            'items' => 'nullable|array'
        ]);

        // Check if a jobcard already exists for this job_home_id
        $existingJobCard = JobCard::where('job_home_id', $validated['job_home_id'])->first();
        if ($existingJobCard) {
            return response()->json(['message' => 'Job card already exists for this job home.', 'id' => $existingJobCard->id], 409);
        }

        \Log::info('Creating jobCard with validated data');
        $jobCard = JobCard::create($validated);
        \Log::info('JobCard created with ID: ' . $jobCard->id);

        // Update customer_id in related JobHome
        if (isset($validated['customer_id'])) {
            $jobHome = \App\Models\JobHome::find($jobCard->job_home_id);
            if ($jobHome) {
                $jobHome->customer_id = $validated['customer_id'];
                $jobHome->save();
            }
        }

        if ($request->has('items')) {
            \Log::info('Received items: ' . json_encode($request->items));
            foreach ($request->items as $item) {
                \Log::info('Processing item: ' . json_encode($item));
                if (!empty($item['materials'])) {
                    \App\Models\JobItem::create([
                        'job_home_id' => $jobCard->job_home_id,
                        'materials_no' => $item['materialsNo'] ?? '',
                        'materials' => $item['materials'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'] ?? 0,
                    ]);
                    \Log::info('JobItem created for jobHome ID: ' . $jobCard->job_home_id);
                }
            }
        }

        return response()->json(['message' => 'Job card created successfully.', 'id' => $jobCard->id]);
    }
    public function update(Request $request, $id)
    {
        $jobCard = JobCard::findOrFail($id);

        $validated = $request->validate([
            'selected_date' => 'required|date',
            'customer_name' => 'required|string',
            'customer_id' => 'nullable|exists:customers,id',
            'fam_no' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'area' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'branch_sc' => 'nullable|string',
            'generator_make' => 'nullable|string',
            'kva' => 'nullable|string',
            'engine_make' => 'nullable|string',
            'last_service' => 'nullable|string',
            'alternator_make' => 'nullable|string',
            'gen_model' => 'nullable|string',
            'controller_module' => 'nullable|string',
            'avr' => 'nullable|string',
            'ats_info' => 'nullable|string',
            'job_description' => 'nullable|string',
            'filters' => 'nullable|array',
            'items' => 'nullable|array'
        ]);

        $jobCard->update($validated);

        // Update customer_id in related JobHome
        if (isset($validated['customer_id'])) {
            $jobHome = \App\Models\JobHome::find($jobCard->job_home_id);
            if ($jobHome) {
                $jobHome->customer_id = $validated['customer_id'];
                $jobHome->save();
            }
        }

        $jobHomeId = $jobCard->job_home_id;

        // Get existing job items for this job_home_id
        $existingItems = \App\Models\JobItem::where('job_home_id', $jobHomeId)->get();

        $incomingItems = collect($request->items ?? []);

        // Update or create items
        foreach ($incomingItems as $item) {
            if (!empty($item['materials'])) {
                $existingItem = $existingItems->firstWhere('materials_no', $item['materialsNo'] ?? '');

                if ($existingItem) {
                    // Update existing item
                    $existingItem->update([
                        'materials' => $item['materials'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'] ?? 0,
                    ]);
                } else {
                    // Create new item
                    \App\Models\JobItem::create([
                        'job_home_id' => $jobHomeId,
                        'materials_no' => $item['materialsNo'] ?? '',
                        'materials' => $item['materials'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'] ?? 0,
                    ]);
                }
            }
        }

        // Delete items not present in incoming request
        $incomingMaterialsNos = $incomingItems->pluck('materialsNo')->filter()->all();

        foreach ($existingItems as $existingItem) {
            if (!in_array($existingItem->materials_no, $incomingMaterialsNos)) {
                $existingItem->delete();
            }
        }

        return response()->json(['message' => 'Job card updated successfully.']);
    }

    public function show($id)
    {
        $jobCard = JobCard::with('jobHome', 'items')->findOrFail($id);
        return response()->json($jobCard);
    }
}
