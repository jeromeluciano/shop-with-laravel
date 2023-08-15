<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $items = ['T-Shirt', 'Short', 'Bag', 'Slipper'];
        $productName = fake()->company() . " " . Arr::random($items);

        return [
            'name' => $productName,
            'price' => fake()->numberBetween(10000, 100000),
            'slug' => fake()->slug()
        ];
    }
}
