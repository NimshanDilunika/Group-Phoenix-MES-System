<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AreaController extends Controller
{
    public function index()
    {
        // Return all areas with branches
        $areas = Area::with('branches')->get();
        return response()->json($areas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'areaName' => 'required|string|max:100',
            'branches' => 'array',
            'branches.*.branchName' => 'required|string|max:100',
            'branches.*.branchPhone' => 'nullable|string|max:20',
        ]);

        $area = Area::create([
            'area_name' => $validated['areaName'],
        ]);

        if (!empty($validated['branches'])) {
            $branchIds = [];
            foreach ($validated['branches'] as $branchData) {
                $branch = Branch::firstOrCreate([
                    'branch_name' => $branchData['branchName'],
                    'branch_phoneno' => $branchData['branchPhone'] ?? null,
                ]);
                $branchIds[] = $branch->branch_id;
            }
            $area->branches()->sync($branchIds);
        }

        return response()->json($area->load('branches'), 201);
    }

    public function update(Request $request, $id)
    {
        $area = Area::findOrFail($id);

        $validated = $request->validate([
            'areaName' => 'required|string|max:100',
            'branches' => 'array',
            'branches.*.branch_id' => 'nullable|integer|exists:branches,branch_id',
            'branches.*.branchName' => 'required|string|max:100',
            'branches.*.branchPhone' => 'nullable|string|max:20',
        ]);

        $area->update([
            'area_name' => $validated['areaName'],
        ]);

        $branchIds = [];
        foreach ($validated['branches'] as $branchData) {
            if (!empty($branchData['branch_id'])) {
                $branch = Branch::findOrFail($branchData['branch_id']);
                $branch->update([
                    'branch_name' => $branchData['branchName'],
                    'branch_phoneno' => $branchData['branchPhone'] ?? null,
                ]);
                $branchIds[] = $branchData['branch_id'];
            } else {
                $newBranch = Branch::create([
                    'branch_name' => $branchData['branchName'],
                    'branch_phoneno' => $branchData['branchPhone'] ?? null,
                ]);
                $branchIds[] = $newBranch->branch_id;
            }
        }

        $area->branches()->sync($branchIds);

        return response()->json($area->load('branches'));
    }

    public function destroy($id)
    {
        $area = Area::findOrFail($id);
        // Detach branches first
        $area->branches()->detach();
        $area->delete();

        return response()->json(null, 204);
    }
}
