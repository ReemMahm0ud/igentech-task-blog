<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;

class CheckPhoneVerification
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $phone = $request->input('phone');

        if (!$phone || !Cache::get('verified_' . $phone)) {
            return response()->json(['message' => 'Phone number not verified'], 403);
        }

        return $next($request);
    }
}
