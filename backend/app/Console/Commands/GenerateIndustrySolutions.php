<?php

namespace App\Console\Commands;

use App\Models\IndustrySolution;
use App\Models\Listing;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GenerateIndustrySolutions extends Command
{
    protected $signature = 'industries:generate
                            {--key= : 只生成指定 industry_key}
                            {--seed : 仅填充行业元数据，不调用 AI 生成}
                            {--force : 重新生成已完成的行业}
                            {--dry-run : 打印 prompt，不实际调用 API}';

    protected $description = '批量生成行业解决方案：填充 industry_solutions 表并调用 Claude API 生成 listing 内容';

    /**
     * 行业定义表 —— 每个行业的元数据
     * 以生鲜门店为模板，定义20+行业
     *
     * @var array<int, array<string, mixed>>
     */
    private function industryDefinitions(): array
    {
        return [
            [
                'industry_key' => 'fresh_market',
                'name'         => '生鲜门店',
                'emoji'        => '🥦',
                'tagline'      => '专为生鲜连锁门店打造的全链路 AI 经营系统',
                'pain_points'  => ['规格混乱，整进零出难以对账', '商品品类和价格变化快', '员工忙碌，无暇录入数据', '损耗高，临期处理不及时'],
                'target_users' => ['生鲜连锁门店店长', '生鲜超市运营总监', '农贸市场档主', '社区生鲜买手店'],
                'modules'      => ['AI 店长助手（语音/拍照上报）', '商品库与实时库存系统', 'AI 智能下单预测', 'AI 促销清货引擎', '竞品情报系统', '财务支出智能管理', '人事人才库', '多维数据看板', '权限管理中心'],
                'keywords'     => ['生鲜', '蔬菜', '水果', '门店', '库存', '损耗', '进货', '促销'],
                'price'        => 299.00,
                'listing_slug' => 'fresh-market-ai-manager',
            ],
            [
                'industry_key' => 'restaurant_chain',
                'name'         => '餐饮连锁',
                'emoji'        => '🍜',
                'tagline'      => '覆盖点单、备料、出餐、复盘的餐饮全链路 AI 管理系统',
                'pain_points'  => ['食材备货难以精准，浪费严重', '多门店排班和人力成本难管控', '菜单定价缺乏数据支撑', '外卖平台评价响应滞后'],
                'target_users' => ['餐饮连锁运营总监', '单店店长', '中央厨房管理员', '餐饮加盟主'],
                'modules'      => ['AI 备料预测（历史+节假日因子）', '智能排班系统', '菜单定价优化建议', '外卖平台评论自动回复', '食材供应商管理', '每日经营复盘报告', '多门店数据看板'],
                'keywords'     => ['餐饮', '餐厅', '菜单', '备料', '外卖', '排班', '食材'],
                'price'        => 299.00,
                'listing_slug' => 'restaurant-chain-ai-manager',
            ],
            [
                'industry_key' => 'retail_clothing',
                'name'         => '服装零售',
                'emoji'        => '👗',
                'tagline'      => '覆盖选款、陈列、促销到库存清仓的服装零售 AI 助手',
                'pain_points'  => ['选款依赖买手经验，新款滞销风险高', '库存积压、尾货处理困难', '导购转化率低', '季节性促销节奏难把控'],
                'target_users' => ['服装零售店长', '买手', '陈列师', '服装品牌运营'],
                'modules'      => ['AI 选款建议（基于销售数据+趋势）', '智能陈列方案生成', '尾货清仓促销策略', '导购话术训练助手', '库存周转率分析', '季节换季预警', '竞品款式情报'],
                'keywords'     => ['服装', '零售', '选款', '库存', '尾货', '导购', '陈列'],
                'price'        => 199.00,
                'listing_slug' => 'clothing-retail-ai-manager',
            ],
            [
                'industry_key' => 'education_center',
                'name'         => '教育培训机构',
                'emoji'        => '🎓',
                'tagline'      => '从招生到续费，覆盖教培机构全运营周期的 AI 管理中台',
                'pain_points'  => ['招生转化漏斗不透明', '课程排期和师资调配低效', '学员学习效果跟进靠人工', '续费率低，流失预警缺失'],
                'target_users' => ['教培机构校长', '招生顾问', '教务主任', 'K12 培训机构运营'],
                'modules'      => ['AI 招生线索评分与跟进', '智能排课系统', '学员学情分析报告', '续费预警与挽留策略', '课后作业批改辅助', '师资绩效数据看板', '家长沟通话术助手'],
                'keywords'     => ['教育', '培训', '招生', '课程', '学员', '续费', '作业'],
                'price'        => 199.00,
                'listing_slug' => 'education-center-ai-manager',
            ],
            [
                'industry_key' => 'beauty_salon',
                'name'         => '美容美发门店',
                'emoji'        => '💇',
                'tagline'      => '覆盖预约、服务、复购的美容美发连锁 AI 管家',
                'pain_points'  => ['预约管理混乱，爽约率高', '技师绩效难以量化', '产品销售转化依赖个人能力', '老客户流失没有预警'],
                'target_users' => ['美容院/发廊店长', '美业连锁运营', '美容顾问', '美甲店主'],
                'modules'      => ['智能预约与提醒系统', 'AI 客户画像与复购预测', '技师绩效分析看板', '产品推荐话术生成', '会员积分与活动策划', '爽约风险预警', '服务后评价自动收集'],
                'keywords'     => ['美容', '美发', '预约', '技师', '会员', '复购', '美甲'],
                'price'        => 199.00,
                'listing_slug' => 'beauty-salon-ai-manager',
            ],
            [
                'industry_key' => 'clinic',
                'name'         => '诊所 / 口腔门诊',
                'emoji'        => '🦷',
                'tagline'      => '为中小型诊所打造的患者管理与运营效率 AI 系统',
                'pain_points'  => ['患者预约和复诊提醒靠人工', '病历和耗材记录混乱', '患者流失率高，复诊召回困难', '医保结算和财务核算繁琐'],
                'target_users' => ['口腔诊所院长', '全科诊所管理者', '前台护士长', '连锁医疗机构运营'],
                'modules'      => ['智能预约与复诊提醒', '患者档案 AI 管理', '耗材库存预警', '患者召回话术生成', '治疗方案费用自动核算', '医生绩效看板', '差评预警与处理建议'],
                'keywords'     => ['诊所', '口腔', '患者', '复诊', '预约', '耗材', '病历'],
                'price'        => 299.00,
                'listing_slug' => 'clinic-ai-manager',
            ],
            [
                'industry_key' => 'gym',
                'name'         => '健身房 / 瑜伽馆',
                'emoji'        => '💪',
                'tagline'      => '从获客到留存，覆盖健身馆全周期的 AI 运营助手',
                'pain_points'  => ['私教销售转化率低', '会员续费到期流失无预警', '场馆排课利用率低', '员工提成核算复杂易出错'],
                'target_users' => ['健身房馆长', '私教主管', '瑜伽馆运营', '连锁健身品牌运营总监'],
                'modules'      => ['会员到期续费预警与话术', '私教课程销售漏斗分析', '智能排课与场地利用优化', '员工提成自动核算', 'AI 训练计划生成', '新会员体测报告自动生成', '活动策划与推送助手'],
                'keywords'     => ['健身', '瑜伽', '会员', '私教', '续费', '排课', '体测'],
                'price'        => 199.00,
                'listing_slug' => 'gym-ai-manager',
            ],
            [
                'industry_key' => 'property_management',
                'name'         => '物业管理',
                'emoji'        => '🏢',
                'tagline'      => '覆盖报修、收费、巡检的智慧物业 AI 管理平台',
                'pain_points'  => ['业主报修响应慢，满意度低', '物业费催缴靠人工，欠费难追', '公共设施巡检记录不规范', '多楼盘数据分散，难以统筹'],
                'target_users' => ['物业项目经理', '物业公司总部运营', '客服主管', '设施设备负责人'],
                'modules'      => ['AI 报修工单自动分发', '物业费智能催缴系统', '设施巡检语音上报', '业主满意度分析', '多楼盘数据汇总看板', '供应商管理与费用核算', '紧急事件预警与处理流程'],
                'keywords'     => ['物业', '报修', '业主', '收费', '巡检', '楼盘', '设施'],
                'price'        => 299.00,
                'listing_slug' => 'property-management-ai',
            ],
            [
                'industry_key' => 'logistics_warehouse',
                'name'         => '仓储物流',
                'emoji'        => '📦',
                'tagline'      => '从入库到配送，覆盖仓储物流全流程的 AI 调度系统',
                'pain_points'  => ['库位混乱，拣货效率低', '配送路线依赖老司机经验', '货损追责困难', '旺季人力调配混乱'],
                'target_users' => ['仓库主管', '物流配送负责人', '供应链经理', '电商仓储运营'],
                'modules'      => ['AI 库位优化建议', '智能拣货路径规划', '配送路线 AI 优化', '货损记录与责任追溯', '旺季人力需求预测', '入出库数据看板', '供应商到货准时率分析'],
                'keywords'     => ['仓储', '物流', '配送', '库位', '拣货', '货损', '入库'],
                'price'        => 299.00,
                'listing_slug' => 'logistics-warehouse-ai',
            ],
            [
                'industry_key' => 'hotel',
                'name'         => '酒店 / 民宿',
                'emoji'        => '🏨',
                'tagline'      => '覆盖预订、入住、清洁到复购的酒店运营 AI 助手',
                'pain_points'  => ['多平台订单管理混乱', '客房清洁调度低效', '差评响应不及时', '淡季定价策略缺乏数据支撑'],
                'target_users' => ['酒店前厅经理', '民宿管家', '酒店集团运营总监', 'OTA 运营专员'],
                'modules'      => ['多平台订单统一管理', '客房清洁智能调度', 'AI 动态定价建议', '差评预警与回复生成', '客户复购与会员召回', '房间状态实时看板', '收益管理分析报告'],
                'keywords'     => ['酒店', '民宿', '预订', '客房', '清洁', 'OTA', '定价'],
                'price'        => 199.00,
                'listing_slug' => 'hotel-ai-manager',
            ],
            [
                'industry_key' => 'auto_repair',
                'name'         => '汽车维修 / 4S 店',
                'emoji'        => '🔧',
                'tagline'      => '从预约到交车，覆盖汽车服务门店全流程的 AI 管理系统',
                'pain_points'  => ['维修工单流转靠口头传达，易出错', '配件库存积压或短缺', '客户进厂频率下降，复购难', '技师工时核算繁琐'],
                'target_users' => ['汽修门店老板', '4S 店服务顾问', '配件库管', '连锁汽服运营总监'],
                'modules'      => ['AI 工单自动生成与流转', '配件库存智能预警', '客户保养到期提醒', '技师工时自动核算', '维修报价 AI 辅助生成', '客户满意度回访', '门店收益分析看板'],
                'keywords'     => ['汽修', '4S', '配件', '工单', '保养', '技师', '维修'],
                'price'        => 299.00,
                'listing_slug' => 'auto-repair-ai-manager',
            ],
            [
                'industry_key' => 'ecommerce_ops',
                'name'         => '电商运营团队',
                'emoji'        => '🛒',
                'tagline'      => '覆盖选品、上架、客服到复盘的电商运营全链路 AI 助手',
                'pain_points'  => ['选品依赖经验，爆款命中率低', '商品上架内容耗时费力', '售后客服压力大', '数据分析维度分散'],
                'target_users' => ['电商运营主管', '天猫/京东店铺负责人', '跨境电商卖家', '品牌电商总监'],
                'modules'      => ['AI 选品竞品分析', '商品标题和详情页生成', '客服话术知识库', '差评自动回复与预警', '广告投放 ROI 分析', '销售数据复盘报告', '仓库发货异常预警'],
                'keywords'     => ['电商', '选品', '上架', '客服', '天猫', '京东', '跨境'],
                'price'        => 199.00,
                'listing_slug' => 'ecommerce-ops-ai',
            ],
            [
                'industry_key' => 'kindergarten',
                'name'         => '幼儿园 / 托育机构',
                'emoji'        => '🧸',
                'tagline'      => '覆盖招生、保育、家园沟通的幼儿园 AI 运营助手',
                'pain_points'  => ['招生旺季线索跟进不及时', '家长沟通占用大量时间', '儿童成长记录耗时且不规范', '课程安排和活动通知效率低'],
                'target_users' => ['幼儿园园长', '招生主任', '班主任', '托育机构运营'],
                'modules'      => ['招生线索 AI 跟进与评分', '家长通知一键群发', '儿童成长档案自动生成', '课程表智能排期', '食谱营养分析建议', '缺勤异常预警', '家长满意度调研'],
                'keywords'     => ['幼儿园', '托育', '招生', '家长', '成长', '保育', '课程'],
                'price'        => 199.00,
                'listing_slug' => 'kindergarten-ai-manager',
            ],
            [
                'industry_key' => 'real_estate_agency',
                'name'         => '房产中介',
                'emoji'        => '🏠',
                'tagline'      => '从带看到成交，覆盖房产中介全业务流程的 AI 销售系统',
                'pain_points'  => ['房源录入和维护效率低', '客户需求匹配靠经纪人记忆', '带看跟进节奏混乱', '成交数据分析缺失'],
                'target_users' => ['房产中介门店经理', '经纪人', '二手房平台运营', '新房销售主管'],
                'modules'      => ['房源信息 AI 结构化录入', '客户需求智能匹配推荐', '带看计划自动提醒', '跟进话术生成', '合同要点风险提示', '经纪人绩效分析', '市场行情周报自动生成'],
                'keywords'     => ['房产', '中介', '房源', '带看', '经纪人', '成交', '租房'],
                'price'        => 199.00,
                'listing_slug' => 'real-estate-agency-ai',
            ],
            [
                'industry_key' => 'law_firm',
                'name'         => '律所 / 法律服务',
                'emoji'        => '⚖️',
                'tagline'      => '覆盖案件管理、合同审查到客户维系的律所 AI 效率系统',
                'pain_points'  => ['案件文书起草耗时', '合同条款风险审查靠经验', '客户档案和进度管理混乱', '业务拓展缺乏系统支持'],
                'target_users' => ['律所主任律师', '法律顾问', '合规经理', '法律援助机构负责人'],
                'modules'      => ['合同智能审查与风险标注', '法律文书 AI 起草助手', '案件进度跟踪系统', '法律法规检索助手', '客户档案管理', '开庭时间提醒', '律所收费与账期管理'],
                'keywords'     => ['律所', '法律', '合同', '案件', '文书', '合规', '律师'],
                'price'        => 299.00,
                'listing_slug' => 'law-firm-ai-assistant',
            ],
            [
                'industry_key' => 'accounting_firm',
                'name'         => '会计师事务所',
                'emoji'        => '📊',
                'tagline'      => '覆盖账务处理、税务申报到客户管理的会计 AI 效率平台',
                'pain_points'  => ['重复性账务处理耗时大', '税务申报节点容易遗漏', '客户财务数据分散难汇总', '年审旺季人力严重不足'],
                'target_users' => ['会计师事务所合伙人', '主办会计', '税务顾问', '中小企业财务外包服务商'],
                'modules'      => ['票据 OCR 智能识别入账', '税务申报日历与提醒', '客户财报自动生成', '异常账务预警', '年审任务清单管理', '客户服务进度跟踪', '税务政策变更推送'],
                'keywords'     => ['会计', '税务', '财务', '账务', '申报', '审计', '票据'],
                'price'        => 299.00,
                'listing_slug' => 'accounting-firm-ai',
            ],
            [
                'industry_key' => 'pet_store',
                'name'         => '宠物店 / 宠物医院',
                'emoji'        => '🐾',
                'tagline'      => '覆盖洗护预约、诊疗记录到复购召回的宠物服务 AI 助手',
                'pain_points'  => ['宠物档案记录不完整', '疫苗和驱虫到期提醒靠人工', '洗护预约调度混乱', '铲屎官复购率低'],
                'target_users' => ['宠物店店长', '宠物医院院长', '宠物美容师', '连锁宠物品牌运营'],
                'modules'      => ['宠物档案 AI 管理', '疫苗/驱虫到期智能提醒', '洗护预约智能调度', '宠物主人复购召回话术', '诊疗记录语音录入', '商品库存与销售分析', '节日营销活动策划'],
                'keywords'     => ['宠物', '洗护', '疫苗', '诊疗', '预约', '宠物医院', '美容'],
                'price'        => 199.00,
                'listing_slug' => 'pet-store-ai-manager',
            ],
            [
                'industry_key' => 'construction_team',
                'name'         => '建筑 / 装修工程队',
                'emoji'        => '🏗️',
                'tagline'      => '覆盖报价、施工管理到验收的装修工程 AI 管理系统',
                'pain_points'  => ['报价不透明，客户信任度低', '施工进度管理依赖工头口头汇报', '材料采购超支无预警', '工人工时核算复杂'],
                'target_users' => ['装修公司老板', '项目经理', '工程监理', '家装设计师'],
                'modules'      => ['AI 报价单自动生成', '施工进度照片上报与汇总', '材料采购预算预警', '工人工时自动核算', '客户验收报告生成', '供应商比价建议', '工程项目数据看板'],
                'keywords'     => ['装修', '建筑', '工程', '报价', '施工', '材料', '工人'],
                'price'        => 299.00,
                'listing_slug' => 'construction-team-ai',
            ],
            [
                'industry_key' => 'hr_agency',
                'name'         => '人力资源 / 招聘机构',
                'emoji'        => '👥',
                'tagline'      => '从简历筛选到候选人跟进，覆盖 HR 全流程的 AI 效率工具',
                'pain_points'  => ['简历筛选耗时，质量参差不齐', '候选人跟进节奏混乱', '岗位需求与候选人匹配靠经验', '客户需求变更响应慢'],
                'target_users' => ['猎头顾问', 'HR BP', '招聘总监', '人力资源外包机构'],
                'modules'      => ['简历 AI 结构化解析与标签', '候选人智能匹配评分', '面试安排自动提醒', '跟进话术生成', '岗位需求分析报告', '候选人 pipeline 看板', '客户满意度跟踪'],
                'keywords'     => ['HR', '招聘', '简历', '候选人', '猎头', '人力资源', '面试'],
                'price'        => 199.00,
                'listing_slug' => 'hr-agency-ai',
            ],
            [
                'industry_key' => 'pharmacy',
                'name'         => '药店 / 连锁药房',
                'emoji'        => '💊',
                'tagline'      => '覆盖药品库存、用药提醒到会员管理的连锁药房 AI 系统',
                'pain_points'  => ['近效期药品处理不及时', '处方药销售合规压力大', '会员复购召回靠人工', '门店药品库存不均衡'],
                'target_users' => ['连锁药房运营总监', '药店店长', '驻店药师', '医药配送负责人'],
                'modules'      => ['近效期药品预警与促销', '处方合规审查辅助', '会员用药周期提醒', '跨门店库存调拨建议', '药品进销存看板', '供应商采购建议', '健康咨询话术知识库'],
                'keywords'     => ['药店', '药房', '药品', '处方', '会员', '库存', '近效期'],
                'price'        => 299.00,
                'listing_slug' => 'pharmacy-ai-manager',
            ],
        ];
    }

    public function handle(): int
    {
        $apiKey = config('services.anthropic.api_key') ?: env('ANTHROPIC_API_KEY');

        if (! $apiKey && ! $this->option('seed') && ! $this->option('dry-run')) {
            $this->error('未找到 ANTHROPIC_API_KEY，请在 .env 中设置，或使用 --seed 仅填充元数据。');

            return self::FAILURE;
        }

        $definitions = $this->industryDefinitions();

        // 过滤指定行业
        if ($key = $this->option('key')) {
            $definitions = array_filter($definitions, fn ($d) => $d['industry_key'] === $key);
            if (empty($definitions)) {
                $this->error("未找到 industry_key={$key}");

                return self::FAILURE;
            }
        }

        $this->info('📋 共 '.count($definitions).' 个行业方案');

        // Step 1: 填充元数据
        foreach ($definitions as $def) {
            $solution = IndustrySolution::firstOrCreate(
                ['industry_key' => $def['industry_key']],
                [
                    'name'        => $def['name'],
                    'emoji'       => $def['emoji'],
                    'tagline'     => $def['tagline'],
                    'pain_points' => $def['pain_points'],
                    'target_users'=> $def['target_users'],
                    'modules'     => $def['modules'],
                    'keywords'    => $def['keywords'],
                    'status'      => 'pending',
                ]
            );

            // 如果已有对应 listing，绑定 listing_id
            if (! $solution->listing_id) {
                $listing = Listing::where('slug', $def['listing_slug'])->first();
                if ($listing) {
                    $solution->update(['listing_id' => $listing->id, 'status' => 'done', 'generated_at' => now()]);
                    $this->line("  ✅ [{$def['name']}] 已绑定现有 listing #{$listing->id}");

                    continue;
                }
            }

            $this->line("  📝 [{$def['name']}] 元数据已写入，状态: {$solution->status}");
        }

        if ($this->option('seed')) {
            $this->info('✅ --seed 模式完成，仅填充元数据，跳过 AI 生成。');

            return self::SUCCESS;
        }

        // Step 2: AI 生成
        $pending = IndustrySolution::where('status', 'pending')
            ->when($this->option('force'), fn ($q) => $q->orWhere('status', 'done'))
            ->when($key = $this->option('key'), fn ($q) => $q->where('industry_key', $key))
            ->get();

        if ($pending->isEmpty()) {
            $this->info('✅ 没有需要生成的行业方案（使用 --force 强制重新生成）。');

            return self::SUCCESS;
        }

        $this->info("\n🤖 开始 AI 生成，共 {$pending->count()} 个...\n");

        $defMap = collect($definitions)->keyBy('industry_key');

        foreach ($pending as $solution) {
            $def = $defMap[$solution->industry_key] ?? null;
            if (! $def) {
                continue;
            }

            $this->line("⏳ 正在生成：{$solution->emoji} {$solution->name}...");
            $solution->update(['status' => 'generating']);

            $prompt = $this->buildPrompt($solution, $def);

            if ($this->option('dry-run')) {
                $this->line("\n--- PROMPT ---\n{$prompt}\n--- END ---\n");
                $solution->update(['status' => 'pending']);

                continue;
            }

            try {
                $result = $this->callClaude($apiKey, $prompt);
                $parsed = $this->parseResult($result);

                // 创建或更新 listing
                $listing = $this->upsertListing($def, $parsed);

                $solution->update([
                    'listing_id'   => $listing->id,
                    'status'       => 'done',
                    'generated_at' => now(),
                    'generation_error' => null,
                ]);

                $this->info("  ✅ 生成完成：{$solution->name} → listing #{$listing->id}");
            } catch (\Throwable $e) {
                $solution->update(['status' => 'failed', 'generation_error' => $e->getMessage()]);
                $this->error("  ❌ 生成失败：{$solution->name} — {$e->getMessage()}");
            }

            // 避免 API 限速
            sleep(2);
        }

        $done   = IndustrySolution::where('status', 'done')->count();
        $failed = IndustrySolution::where('status', 'failed')->count();
        $this->info("\n🎉 完成！成功: {$done}，失败: {$failed}");

        return self::SUCCESS;
    }

    private function buildPrompt(IndustrySolution $solution, array $def): string
    {
        $painPoints   = implode("\n- ", $solution->pain_points);
        $targetUsers  = implode('、', $solution->target_users);
        $modules      = collect($solution->modules)->map(fn ($m, $i) => '① '.($i + 1).'. '.$m)->implode("\n");
        $keywords     = implode('、', $solution->keywords);

        return <<<PROMPT
你是一个 AI 技能市集的产品文案专家。请为以下行业生成一个完整的「行业解决方案」listing 内容。

## 行业信息
- 行业名称：{$solution->name}
- 一句话定位：{$solution->tagline}
- 目标用户：{$targetUsers}
- 核心痛点：
  - {$painPoints}
- 功能模块：
{$modules}
- 关键词：{$keywords}

## 参考模版（生鲜门店 AI 店长助手）
description 示例：
```
专为生鲜连锁门店打造的全链路 AI 经营系统。核心理念：「人工碎片化输入 + AI 结构化处理 + AI 智能决策」，彻底解决生鲜行业规格混乱、信息录入难、损耗高的三大痛点。

涵盖九大功能模块：
① AI 店长助手（语音/拍照上报，企业微信集成）
② 商品库与实时库存系统
③ AI 智能下单预测（天气/节假日多因子模型）
④ AI 促销清货引擎（自动触发，临期预警）
⑤ 竞品情报系统（爬虫+员工上报）
⑥ 财务支出智能管理（OCR 票据识别）
⑦ 人事人才库（自然语言简历搜索）
⑧ 多维数据看板（门店/总部/单品三级）
⑨ 权限管理中心（总部/店长/店员/财务四级）

适用场景：香港/内地生鲜连锁门店、生鲜超市、农贸市场档主升级。
```

demo_messages 示例（JSON 格式，4条对话）：
```json
[
  {"type":"user","text":"胡萝卜今天下午3点就卖完了"},
  {"type":"ai","text":"✅ 已记录：胡萝卜 今日15:00 售罄\n\n📊 AI 分析：\n胡萝卜本周已连续3天提前售罄，今日较昨日提前2小时。\n\n💡 建议：\n明日进货量建议从 50斤 → 70斤（+40%）\n是否立即发送进货调整建议给采购？"},
  {"type":"user","text":"好的，发给采购"},
  {"type":"ai","text":"✅ 已通知采购小王\n📋 明日胡萝卜调整进货单已发送\n\n另：西红柿昨日剩余15斤，今日已是第2天，建议触发8折清货促销，是否确认执行？"}
]
```

## 你的任务
请生成以下内容，**严格按照 JSON 格式输出，不要输出其他内容**：

```json
{
  "description": "...",
  "demo_messages": [
    {"type":"user","text":"..."},
    {"type":"ai","text":"..."},
    {"type":"user","text":"..."},
    {"type":"ai","text":"..."}
  ]
}
```

要求：
1. description：参考模版结构，第一段一句话定位，第二段简要说明核心价值，第三段用①②③...列出所有功能模块，最后一行写适用场景。总长度 300-500 字。
2. demo_messages：4条对话，第一条 user 发起（口语化、碎片化的真实员工输入），AI 回复包含 ✅确认 + 📊分析 + 💡建议 三段，第三条 user 简短确认，第四条 AI 给出执行结果并追加一个新的业务建议。
3. 语言：中文，专业但口语化。
4. 只输出 JSON，不要 markdown 代码块包装，不要解释。
PROMPT;
    }

    private function callClaude(string $apiKey, string $prompt): string
    {
        $model   = config('services.anthropic.model', 'claude-haiku-4-5-20251001');
        $baseUrl = rtrim(config('services.anthropic.base_url', 'https://api.anthropic.com'), '/');

        $response = Http::withHeaders([
            'x-api-key'         => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type'      => 'application/json',
        ])->timeout(120)->post("{$baseUrl}/v1/messages", [
            'model'      => $model,
            'max_tokens' => 4096,
            'messages'   => [
                ['role' => 'user', 'content' => $prompt],
            ],
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Claude API 错误: '.$response->status().' '.$response->body());
        }

        return $response->json('content.0.text', '');
    }

    private function parseResult(string $raw): array
    {
        // 清理可能的 markdown 代码块
        $json = preg_replace('/^```json\s*/m', '', $raw);
        $json = preg_replace('/^```\s*/m', '', $json);
        $json = trim($json);

        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('JSON 解析失败: '.json_last_error_msg()."\n原始内容: ".substr($raw, 0, 200));
        }

        if (empty($data['description']) || empty($data['demo_messages'])) {
            throw new \RuntimeException('生成内容缺少必要字段 description 或 demo_messages');
        }

        return $data;
    }

    private function upsertListing(array $def, array $generated): Listing
    {
        $existing = Listing::where('slug', $def['listing_slug'])->first();

        if ($existing) {
            $existing->update([
                'description'   => $generated['description'],
                'demo_messages' => $generated['demo_messages'],
                'status'        => 'available',
            ]);

            return $existing;
        }

        return Listing::create([
            'name'          => $def['emoji'].' '.$def['name'].' AI 解决方案',
            'slug'          => $def['listing_slug'],
            'price'         => $def['price'],
            'description'   => $generated['description'],
            'image_url'     => null,
            'status'        => 'available',
            'category'      => '行业方案',
            'demo_messages' => $generated['demo_messages'],
        ]);
    }
}
