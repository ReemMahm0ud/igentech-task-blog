<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $posts = Post::with('user')->get();
        foreach($posts as $post){
            $post->getMedia();
        }
        return response()->json(['message' => 'posts fetched successfully', 'posts'=> $posts], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $fields = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
        ]);

        $post = $request->user()->posts()->create($fields);
        if ($request->hasFile('images')) {
            $fileAdders = $post->addMultipleMediaFromRequest(['images'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('images');
                });
        }
        // $post->addMultipleMediaFromRequest('images')->withResponsiveImages()->toMediaCollection('images');

        return response()->json(['message' => 'post created successfully', 'post'=> $post], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $post = Post::with('user')->find($id);
        // dd($post);
        $mediaItems = $post->getMedia();

        return response()->json(['post' => $post], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //

        // Log::info('Array contents: ', $request->all());
        // dd($request->all);

        $post = Post::find($id);
        Gate::authorize('modify', $post);
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        // dd($request->all());
        Log::info('Array contents: ', $request->all());
        if ($request->hasFile('images')) {
            $post->clearMediaCollection('images');
            $fileAdders = $post->addMultipleMediaFromRequest(['images'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection();
                });
        }
        $post->update($request->all());
        return response()->json(['message' =>'updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $post = Post::find($id);
        Gate::authorize('modify', $post);
        $post->clearMediaCollection('images');
        $post->delete();
        return response()->json(['message' =>'deleted successfully']);
    }
}
