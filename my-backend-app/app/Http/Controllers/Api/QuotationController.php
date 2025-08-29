<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use App\Models\JobCard; // Add this import
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class QuotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Retrieve all quotations from the database
        $quotations = Quotation::all();

        // Return a JSON response with the quotations
        return response()->json($quotations);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    // Validate incoming data
    $validatedData = $request->validate([
        'job_card_id' => 'required|exists:job_cards,id',
        'attention' => 'nullable|string',
        'quotation_no' => 'nullable|string',
        'select_date' => 'nullable|date',
        'region' => 'nullable|string',
        'ref_qtn' => 'nullable|string',
        'site' => 'nullable|string',
        'job_date' => 'nullable|date',
        'fam_no' => 'nullable|string',
        'complain_nature' => 'nullable|string',
        'po_no' => 'nullable|string',
        'po_date' => 'nullable|date',
        'actual_break_down' => 'nullable|string',
        'tender_no' => 'nullable|string',
        'signed_date' => 'nullable|date',
        'total_without_tax' => 'nullable|numeric',
        'vat' => 'nullable|numeric',
        'total_with_tax' => 'nullable|numeric',
        'discount' => 'nullable|numeric',
        'total_with_tax_vs_disc' => 'nullable|numeric',
        'special_note' => 'nullable|string',
    ]);

    // Check if a quotation already exists for this job card
    $existingQuotation = Quotation::where('job_card_id', $validatedData['job_card_id'])->first();

    if ($existingQuotation) {
        return response()->json([
            'message' => 'Quotation already exists.',
            'quotation' => $existingQuotation
        ], Response::HTTP_OK);
    }

    // Create a new quotation
    $quotation = Quotation::create($validatedData);

    return response()->json($quotation, Response::HTTP_CREATED);
}
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Quotation  $quotation
     * @return \Illuminate\Http\Response
     */
    public function show(Quotation $quotation)
    {
        // The $quotation model is automatically resolved by route model binding
        // Return a JSON response with the specific quotation
        return response()->json($quotation);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Quotation  $quotation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Quotation $quotation)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'job_card_id' => 'sometimes|required|exists:job_cards,id',
            'attention' => 'sometimes|nullable|string',
            'quotation_no' => 'sometimes|nullable|string',
            'select_date' => 'sometimes|nullable|date',
            // Use 'sometimes' for all fields that are not always required for updates
            'region' => 'sometimes|nullable|string',
            'ref_qtn' => 'sometimes|nullable|string',
            'site' => 'sometimes|nullable|string',
            'job_date' => 'sometimes|nullable|date',
            'fam_no' => 'sometimes|nullable|string',
            'complain_nature' => 'sometimes|nullable|string',
            'po_no' => 'sometimes|nullable|string',
            'po_date' => 'sometimes|nullable|date',
            'actual_break_down' => 'sometimes|nullable|string',
            'tender_no' => 'sometimes|nullable|string',
            'signed_date' => 'sometimes|nullable|date',
            'total_without_tax' => 'sometimes|nullable|numeric',
            'vat' => 'sometimes|nullable|numeric',
            'total_with_tax' => 'sometimes|nullable|numeric',
            'discount' => 'sometimes|nullable|numeric',
            'total_with_tax_vs_disc' => 'sometimes|nullable|numeric',
            'special_note' => 'sometimes|nullable|string',
        ]);

        // Update the quotation with the validated data
        $quotation->update($validatedData);

        // Return a JSON response with the updated quotation
        return response()->json($quotation);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Quotation  $quotation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Quotation $quotation)
    {
        // The $quotation model is automatically resolved
        $quotation->delete();

        // Return a no-content response
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function itemshow($jobCardId)
    {
        try {
            // Find the Quotation associated with the given jobCardId
            // Eager load the chain: Quotation -> JobCard -> JobHome -> JobItems
            $quotation = Quotation::where('job_card_id', $jobCardId)
                      ->with('jobCard.jobHome.jobItems')  // Correct eager load
                      ->first();

            // Check if the quotation exists
            if (!$quotation) {
                return response()->json(['message' => 'Quotation not found for this Job Card.'], Response::HTTP_NOT_FOUND);
            }

            // Safely access the job items through the relationship chain
            // Use null coalescing operator (??) and collect() to handle cases where relationships might be missing
            $jobItems = $quotation->jobCard->jobHome->jobItems ?? collect();

            // Map the items to a more front-end friendly format
            $items = $jobItems->map(function ($item) {
                // Ensure unit_price and quantity are treated as numbers for calculation
                $unitPrice = (float)$item->unit_price;
                $quantity = (int)$item->quantity;
                $unitTotalPrice = $quantity * $unitPrice;

                return [
                    'id' => $item->id,
                    'materialsNo' => $item->materials_no,
                    'description' => $item->materials,
                    'unitPrice' => $unitPrice,
                    'quantity' => $quantity,
                    'unitTotalPrice' => (float)number_format($unitTotalPrice, 2, '.', ''),
                ];
            });

            // Calculate totals
            $subtotal = $items->sum('unitTotalPrice');
            $taxRate = 0.10; // 10% tax
            $tax = $subtotal * $taxRate;
            $grandTotal = $subtotal + $tax;

            // Prepare the final JSON response
            return response()->json([
                'id' => $quotation->id,
                'quotation_no' => $quotation->quotation_no,
                // Safely access customer name from the JobCard
                'customer_name' => $quotation->jobCard->customer_name ?? null,
                'items' => $items,
                'subtotal' => (float)number_format($subtotal, 2, '.', ''),
                'tax' => (float)number_format($tax, 2, '.', ''),
                'grandTotal' => (float)number_format($grandTotal, 2, '.', ''),
            ]);

        } catch (\Exception $e) {
            // Log the error for debugging purposes
            Log::error('Error fetching quotation details: ' . $e->getMessage());

            // Return a generic server error response
            return response()->json(['message' => 'Internal server error.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update only the unit_price of items associated with a JobCard via Quotation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $jobCardId
     * @return \Illuminate\Http\Response
     */
    public function updatePrices(Request $request, $jobCardId)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:job_items,id',
            'items.*.unitPrice' => 'required|numeric|min:0',
        ]);

        try {
            // Find the quotation related to the jobCardId
           $quotation = Quotation::where('job_card_id', $jobCardId)
                      ->with('jobCard.jobHome.jobItems')  // Correct eager load
                      ->first();

            if (!$quotation || !$quotation->jobCard || !$quotation->jobCard->jobHome) {
                return response()->json(['message' => 'Quotation or associated Job Home not found.'], Response::HTTP_NOT_FOUND);
            }

            $jobHome = $quotation->jobCard->jobHome;

            // Loop through the items received from the frontend and update only the unit_price
            foreach ($validatedData['items'] as $itemData) {
                // Find the specific JobItem that belongs to this JobHome
                $item = $jobHome->jobItems()->find($itemData['id']);

                if ($item) {
                    $item->update([
                        'unit_price' => $itemData['unitPrice'],
                    ]);
                }
            }

            // Optionally, you might want to recalculate and update totals on the Quotation model
            // if they are stored in the database. This would require fetching the updated items
            // and then updating the Quotation model.

            return response()->json(['message' => 'Prices updated successfully.']);

        } catch (\Exception $e) {
            Log::error('Error updating item prices: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}