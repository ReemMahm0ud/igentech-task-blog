<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class AdminController extends Controller
{
    //

    public function createUser (Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'phone' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'avatar' => 'image|mimes:jpeg,png,jpg,gif'
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

        return response()->json(['message' => 'User created successfully'], 201);

    }


    public function getUser (Request $request, $id)
    {
        $user =  User::find($id)->first();
        $mediaItems = $user->getMedia();
        $publicFullUrl = $mediaItems[0]->getFullUrl();
        return response()->json(['message' => $user, "media"=> $publicFullUrl], 400);
    }

    public function getAllUsers (Request $request)
    {
        // $user =  $request->user();

        // if($user->role == 1)
        // {
            $users = User::all();
            foreach($users as $user){
                $user->getMedia();
            }
            return response()->json(['message' =>'fetched successfully', "users"=> $users]);
        // }
    }

    public function updateUser (Request $request,$id)
    {
        // print_r($request->all());
        // error_log($request->all());
        Log::info('Array contents: ', $request->all());
        $user =  User::find($id)->first();
        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'phone' => 'string|unique:users',
            'email' => 'string|email|unique:users',
            // 'avatar' => 'image|mimes:jpeg,png,jpg,gif'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        // dd($request->name);

        if($request->file('avatar'))
        {
            if ($user->hasMedia()) {
                $user->clearMediaCollection();
            }
            $user->addMediaFromRequest('avatar')->withResponsiveImages()->toMediaCollection('avatars');
        }
        $user->update($request->all());
        return response()->json(['message' =>'updated successfully']);
    }

    public function deleteUser(Request $request,$id)
    {
        $user =  User::find($id);
        if ($user->hasMedia('avatars')) {
            $user->clearMediaCollection('avatars');
        }
        $userDeleted = User::find($id)->delete();

        return response()->json(['message' =>'deleted successfully'],200);

    }

}
