<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PostController;
use App\Http\Middleware\CheckPhoneVerification;
use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\Cors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


//otp routes
Route::post('/sendSms', [UserController::class,'requestOTP']);
Route::post('/verify', [UserController::class,'verifyNumber']);

//auth routes
Route::post('/register', [UserController::class,'register'])->middleware(CheckPhoneVerification::class);
Route::post('/login', [UserController::class,'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');


//user profile routes
Route::get('/getUser', [UserController::class,'getUser'])->middleware('auth:sanctum');
Route::put('/updateProfile', [UserController::class,'updateUser'])->middleware('auth:sanctum');


//admin routes
Route::post('/createUser',[AdminController::class, 'createUser'])->middleware(['auth:sanctum', CheckUserRole::class]);
Route::get('/getUser/{id}',[AdminController::class, 'getUser'])->middleware(['auth:sanctum', CheckUserRole::class]);
Route::get('/usersList',[AdminController::class, 'getAllUsers'])->middleware(['auth:sanctum', CheckUserRole::class]);
Route::put('/updateUser/{id}',[AdminController::class, 'updateUser'])->middleware(['auth:sanctum', CheckUserRole::class, Cors::class]);
Route::delete('/deleteUser/{id}',[AdminController::class, 'deleteUser'])->middleware(['auth:sanctum', CheckUserRole::class]);


//post routes
Route::get("/postsList",[PostController::class, 'index'])->middleware('auth:sanctum');
Route::post('/createPost',[PostController::class, 'store'])->middleware('auth:sanctum');
Route::get('/getPost/{id}',[PostController::class, 'show'])->middleware('auth:sanctum');
Route::put('/updatePost/{id}',[PostController::class, 'update'])->middleware(['auth:sanctum', Cors::class]);
Route::delete('/deletePost/{id}',[PostController::class, 'destroy'])->middleware('auth:sanctum');
