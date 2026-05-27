<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'title' => 'Post '.\Illuminate\Support\Str::random(8),
            'content' => 'Content '.\Illuminate\Support\Str::random(40),
            'published' => (bool) random_int(0, 1),
        ];
    }
}
