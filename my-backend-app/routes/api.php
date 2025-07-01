<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CustomerController;

use App\Http\Controllers\CompanySettingsController; // Assuming you still have this
use App\Http\Controllers\ProfileController; // Add this lin
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ItemController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
// These routes are accessible to anyone without a login token.
Route::post('/login', [AuthController::class, 'login']);
// Route::post('/register', [AuthController::class, 'register']); // Assuming this is for general user registration

// Protected routes (require authentication via Sanctum token)
// Routes within this group will require a valid API token to be accessed.
Route::middleware('auth:sanctum')->group(function () {
    // Get authenticated user's details
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Profile route to get authenticated user's profile
    Route::get('/profile', [ProfileController::class, 'show']);

    // Logout endpoint
    Route::post('/logout', [AuthController::class, 'logout']);

    // User management routes
    // It's highly recommended that these routes also have additional authorization
    // (e.g., only 'Administrator' roles can access 'store' or 'index').

    // Get all users (typically an admin-only function)
    Route::get('/users', [UserController::class, 'index']);

    // Route for adding a new user (likely an admin-only function)
    // The UserController@store method allows setting roles (Administrator, Manager, Staff),
    // which implies it should be a protected route and likely require specific permissions.
    Route::post('/users', [UserController::class, 'store']);

    // Update user role
    Route::patch('/users/{id}', [UserController::class, 'update']);

    // Delete user
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Update user role
    Route::patch('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);

    Route::patch('/profile', [ProfileController::class, 'update']); 
    Route::put('/profile', [ProfileController::class, 'update']);

    // Add new route to delete customers by branch type
    Route::delete('/customers/delete-by-branch-type/{branchName}', [CustomerController::class, 'deleteByBranchType']);
});

Route::middleware('auth:sanctum')->group(function () {
    // This covers all CRUD operations for items: index, store, show, update, destroy
    Route::apiResource('items', ItemController::class);
});

// Item routes moved outside auth:sanctum middleware to make them public
Route::post('/items', [ItemController::class, 'store']);
Route::get('/items', [ItemController::class, 'index']); // Optional: to fetch all items
Route::put('/items/{id}', [ItemController::class, 'update']);
Route::patch('/items/{id}', [ItemController::class, 'update']);
Route::delete('/items/{id}', [ItemController::class, 'destroy']);

Route::get('/company-settings', [CompanySettingsController::class, 'show']);
Route::post('/company-settings', [CompanySettingsController::class, 'update']);
Route::get('/company-settings/logo/{id}', [CompanySettingsController::class, 'logo'])->name('company.logo');
Route::get('/profile/image/{id}', [ProfileController::class, 'profileImage'])->name('user.profile.image');

use App\Http\Controllers\Api\AreaController;

Route::get('/areas', [CustomerController::class, 'areas']);
Route::apiResource('customers', CustomerController::class);


Route::apiResource('areas', AreaController::class);
