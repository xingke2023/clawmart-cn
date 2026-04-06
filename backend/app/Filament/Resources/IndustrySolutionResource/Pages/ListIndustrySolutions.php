<?php

namespace App\Filament\Resources\IndustrySolutionResource\Pages;

use App\Filament\Resources\IndustrySolutionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListIndustrySolutions extends ListRecords
{
    protected static string $resource = IndustrySolutionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
