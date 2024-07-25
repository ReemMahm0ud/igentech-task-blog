<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class OTPService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'headers' => [
                'Authorization' => 'App ' . env('INFOBIP_API_KEY'),
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
        ]);
    }

    public function sendOTP($phoneNumber)
    {
        $otp = rand(100000, 999999);
        $message = "Your OTP code is: $otp";

        // Cache the OTP code with a 15-minute expiration time
        Cache::put('otp_' . $phoneNumber, $otp, now()->addMinutes(15));

        $body = [
            'messages' => [
                [
                    'destinations' => [
                        ['to' => $phoneNumber]
                    ],
                    'from' => 'ServiceSMS',
                    'text' => $message
                ]
            ]
        ];
        // dd($this->client);

        try {
            $response = $this->client->post('https://43x62p.api.infobip.com/sms/2/text/advanced', [
                'json' => $body
            ]);

            if ($response->getStatusCode() == 200) {
                return response()->json(['message' => 'OTP sent successfully' , 'otp' => $otp], 200);
            } else {
                return response()->json(['message' => 'Failed to send OTP', 'error' => $response->getReasonPhrase()], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send OTP', 'error' => $e->getMessage()], 400);
        }
    }

    public function verifyOTP($phoneNumber, $otp)
    {
        $cachedOTP = Cache::get('otp_' . $phoneNumber);
        // dd($cachedOTP);

        if ($cachedOTP && $cachedOTP == $otp) {
            Cache::forget('otp_' . $phoneNumber);
            return true;
        }

        return false;
    }
}
