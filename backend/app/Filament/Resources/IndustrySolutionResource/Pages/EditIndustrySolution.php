<?php

namespace App\Filament\Resources\IndustrySolutionResource\Pages;

use App\Filament\Resources\IndustrySolutionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditIndustrySolution extends EditRecord
{
    protected static string $resource = IndustrySolutionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
