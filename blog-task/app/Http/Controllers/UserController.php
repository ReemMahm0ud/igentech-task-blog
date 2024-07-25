<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    protected $otpService;

    public function __construct( OTPService $otpService)
    {
        $this->otpService = $otpService;
    }
    //
    public function requestOTP (Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        return $this->otpService->sendOTP($request->phone);
    }

    public function verifyNumber (Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'otp' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $isValid = $this->otpService->verifyOTP($request->phone, $request->otp);



        if ($isValid) {
            Cache::put('verified_' . $request->phone, true, now()->addMinutes(15));
            return response()->json(['message' => 'OTP verified successfully'], 200);
        }

        return response()->json(['message' => 'Invalid OTP'], 400);
    }


    public function register (Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'phone' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'avatar' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }


        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
        ]);

        $user->addMediaFromRequest('avatar')->withResponsiveImages()->toMediaCollection('avatars');
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json(['message' => 'User registered successfully', 'token'=> $token], 201);

    }


    // public function login (Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|string|exists:users,email',
    //         'phone' => 'required|string|exists:users,phone',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
    //     }

    //     return $this->otpService->sendOTP($request->phone);
    // }

    public function login (Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|exists:users,phone',
            'otp' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $isValid = $this->otpService->verifyOTP($request->phone, $request->otp);

        if ($isValid) {
            $user = User::where('phone', $request->phone)->first();

            if ($user) {
                $token = $user->createToken('authToken')->plainTextToken;
                return response()->json(['message' => 'OTP verified successfully', 'token' => $token], 200);
            }
        }

        return response()->json(['message' => 'Invalid OTP or user not found', 'valid'=>$isValid], 400);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return [
            'message' => 'You are logged out.'
        ];
    }

    public function getUser (Request $request)
    {
        $user =  $request->user();
        $mediaItems = $user->getMedia();
        $publicFullUrl = $mediaItems[0]->getFullUrl();
        return response()->json(['message' => $user, "media"=> $publicFullUrl], 200);
    }

    // public function getAllUsers (Request $request)
    // {
    //     $user =  $request->user();

    //     if($user->role == 1)
    //     {
    //         $users = User::all();
    //         return response()->json(['message' =>'fetched scussfully', "users"=> $users]);
    //     }
    // }

    public function updateUser (Request $request)
    {
        $user =$request->user();
        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'phone' => 'string|unique:users',
            'email' => 'string|email|unique:users',
            'avatar' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if($request->avatar)
        {
            if ($user->hasMedia('avatars')) {
                $user->clearMediaCollection('avatars');
            }
            $user->addMediaFromRequest('avatar')->withResponsiveImages()->toMediaCollection('avatars');

        }
        $user->update($validator);
        response()->json(['message' =>'updated successfully']);
    }

}
