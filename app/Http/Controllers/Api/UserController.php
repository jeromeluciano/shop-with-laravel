<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    function purchase()
    {
        $user = User::query()->firstOrCreate(
            [
                'email' => request('email')
            ],
            [
                'password' => Hash::make('password'),
                'name' => request('first_name') . ' ' . request('last_name'),
                'address' => request('address'),
                'city' => request('city'),
                'state' => request('state'),
                'zip_code' => request('zip_code')
            ]
        );

        try {
            // get the user order amount and registered payment_method_id
            // payment_method_id is generated from the frontend using stripe-js
            $payment = $user->charge(
                request('amount'),
                request('payment_method_id')
            );

            $payment = $payment->asStripePaymentIntent();

    
            $order = $user->orders()
                ->create([
                    'transaction_id' => $payment->id,
                    'total' => $payment->amount
                ]);

            foreach (json_decode(request('cart'), true)  as $item) {
                $order->products()
                    ->attach($item['id'], [
                        'quantity' => $item['quantity']
                    ]);
            }

            $order->load('products');
            return $order;
        } catch( \Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
