<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\IndustryClassifierService;
use App\Services\OnboardingValidatorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class OnboardingController extends Controller
{
    /**
     * 把用户的自由文本回答归类到固定行业枚举之一。
     * 公开端点，配合 throttle 中间件防滥用。
     */
    public function classifyIndustry(Request $request, IndustryClassifierService $svc)
    {
        $data = $request->validate([
            'text' => 'required|string|max:200',
        ]);

        $text = trim($data['text']);
        $key  = 'industry_cls:'.md5($text);

        $result = Cache::remember($key, now()->addHours(24), fn () => $svc->classify($text));

        return response()->json($result);
    }

    /**
     * 校验 name / functions / hasAccount 三步的自由文本输入。
     */
    public function validateInput(Request $request, OnboardingValidatorService $svc)
    {
        $data = $request->validate([
            'step' => 'required|in:name,functions,hasAccount',
            'text' => 'required|string|max:200',
        ]);

        $text = trim($data['text']);
        $key  = "onboard_validate:{$data['step']}:".md5($text);

        $result = Cache::remember($key, now()->addHours(24), fn () => $svc->validate($data['step'], $text));

        return response()->json($result);
    }
}
