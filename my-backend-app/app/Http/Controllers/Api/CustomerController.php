<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Branch;

class CustomerController extends Controller
{
    public function index()
    {
        // Return all customers with areas and branches
        $customers = Customer::with('areas.branches')->get();
        return response()->json($customers);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'customer_name' => 'required|string|max:100',
                'email' => 'nullable|email|max:100',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'areas' => 'array',
                'areas.*.areaName' => 'required|string|max:100',
                'areas.*.branches' => 'array',
                'areas.*.branches.*.branchName' => 'required|string|max:100',
                'areas.*.branches.*.branchPhone' => 'nullable|string|max:20',
            ]);

            $customer = Customer::create([
                'customer_name' => $validated['customer_name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);

            $areaIds = [];
            foreach ($validated['areas'] as $areaData) {
                $area = Area::firstOrCreate(['area_name' => $areaData['areaName']]);
                $branchIds = [];
                foreach ($areaData['branches'] as $branchData) {
                    $branch = Branch::firstOrCreate([
                        'branch_name' => $branchData['branchName'],
                        'branch_phoneno' => $branchData['branchPhone'] ?? null,
                    ]);
                    $branchIds[] = $branch->branch_id;
                }
                $area->branches()->sync($branchIds);
                $areaIds[] = $area->area_id;
            }

            $customer->areas()->sync($areaIds);

            return response()->json($customer->load('areas.branches'), 201);

        } catch (\Throwable $e) {
            \Log::error('Customer creation failed: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $customer = Customer::with('areas.branches')->findOrFail($id);
        return response()->json($customer);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'areas' => 'array',
            'areas.*.areaName' => 'required|string|max:100',
            'areas.*.branches' => 'array',
            'areas.*.branches.*.branchName' => 'required|string|max:100',
            'areas.*.branches.*.branchPhone' => 'nullable|string|max:20',
        ]);

        $customer->update([
            'customer_name' => $validated['customer_name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        $areaIds = [];
        foreach ($validated['areas'] as $areaData) {
            $area = Area::firstOrCreate(['area_name' => $areaData['areaName']]);
            $branchIds = [];
            foreach ($areaData['branches'] as $branchData) {
                $branch = Branch::firstOrCreate([
                    'branch_name' => $branchData['branchName'],
                    'branch_phoneno' => $branchData['branchPhone'] ?? null,
                ]);
                $branchIds[] = $branch->branch_id;
            }
            $area->branches()->sync($branchIds);
            $areaIds[] = $area->area_id;
        }

        $customer->areas()->sync($areaIds);

        return response()->json($customer->load('areas.branches'));
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(null, 204);
    }

    public function areas()
    {
        // Return all areas with their branches for frontend selection
        $areas = Area::with('branch')->get();
        return response()->json($areas);
    }

    public function deleteByBranchType($branchName)
    {
        // Find customers who have areas with branches matching the branchName
        $customers = Customer::whereHas('areas.branches', function ($query) use ($branchName) {
            $query->where('branch_name', $branchName);
        })->get();

        $count = $customers->count();

        foreach ($customers as $customer) {
            $customer->delete();
        }

        return response()->json(['message' => "Deleted {$count} customers with branch type '{$branchName}'"]);
    }
}
