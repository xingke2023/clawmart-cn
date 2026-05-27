<?php

namespace Database\Seeders;

use App\Models\StoreProfile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Demo user — seller with store profile
        $demoUser = User::updateOrCreate(
            ['username' => 'demo'],
            [
                'name' => 'Demo User',
                'email' => 'demo@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_seller' => true,
            ]
        );

        StoreProfile::firstOrCreate(
            ['user_id' => $demoUser->id],
            [
                'shop_name' => 'Demo 示范店铺',
                'shop_description' => '这是一个演示店铺，展示 CLAW MART 店铺功能。',
                'store_type' => 'retail',
                'slug' => 'demo-store',
                'is_public' => true,
                'contact_phone' => '400-888-8888',
                'tags' => json_encode(['示范', '演示']),
            ]
        );

        $this->call([
            ListingSeeder::class,
        ]);
    }
}
