'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";
import { CheckCircle2, Zap } from "lucide-react";

// ─── 技能模块配置 ──────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    group: "内容创作 & 自动发布",
    skills: [
      { id: "wechat_article", name: "公众号文案写作及自动发布", desc: "根据主题自动生成公众号推文，排版后一键发布到公众号后台", demo: { avatar: "📱", bg: "#b6e3f4", msgs: [
        { type: "user", text: "帮我写一篇关于夏季促销活动的公众号推文" },
        { type: "ai", text: "好的，正在生成推文内容并排版……" },
        { type: "ai", text: "✅ 推文已生成并发布\n\n📝 标题：「夏日狂欢！这波活动错过再等一年」\n字数：1,240字 | 预计阅读：3分钟\n配图：已自动匹配 3 张素材\n\n已推送到公众号草稿箱，可一键发布。" },
      ]}},
      { id: "xiaohongshu", name: "小红书笔记批量创作", desc: "批量生成小红书图文笔记，含话题标签、封面文案、发布时间建议", demo: { avatar: "📸", bg: "#ffd5dc", msgs: [
        { type: "user", text: "帮我写10篇小红书，主题是夏天防晒护肤" },
        { type: "ai", text: "正在生成差异化角度的种草笔记……" },
        { type: "ai", text: "✅ 10 篇笔记已生成\n\n包含：口播版、图文版、测评版各风格\n每篇含：封面文案 + 正文 + 30个精准话题标签\n最佳发布时间：周二/四 19:00-21:00\n\n已导出 Excel，可直接复制粘贴发布。" },
      ]}},
      { id: "douyin_script", name: "抖音/视频号脚本生成", desc: "输入产品/主题，自动生成口播脚本、分镜提示、字幕文案", demo: { avatar: "🎬", bg: "#d1d4f9", msgs: [
        { type: "user", text: "帮我写一个60秒的抖音带货脚本，产品是空气炸锅" },
        { type: "ai", text: "正在生成高转化口播脚本……" },
        { type: "ai", text: "✅ 脚本已生成\n\n🎯 开场钩子（0-5s）：「你知道为什么同样的薯条，他家的总是更脆吗？」\n📦 产品展示（5-30s）：3个使用场景演示\n💬 痛点共鸣（30-50s）：油烟/热量/清洗痛点\n🛒 转化收尾（50-60s）：限时优惠+行动指令\n\n字幕版已同步生成。" },
      ]}},
      { id: "wechat_moments", name: "朋友圈/社群文案生成", desc: "每日自动生成朋友圈素材、社群活跃话题、节日营销文案", demo: { avatar: "💬", bg: "#ffdfbf", msgs: [
        { type: "user", text: "帮我生成本周5天的朋友圈文案" },
        { type: "ai", text: "正在根据行业特性和近期热点生成……" },
        { type: "ai", text: "✅ 本周朋友圈文案已生成\n\n周一：行业洞察型（塑造专业形象）\n周二：客户案例型（信任背书）\n周三：产品价值型（种草转化）\n周四：互动话题型（提升活跃）\n周五：限时活动型（促进成交）\n\n每条均附配图建议。" },
      ]}},
      { id: "ppt_gen", name: "PPT 自动生成", desc: "输入主题或大纲，自动生成完整 PPT，含排版、图表、配色", demo: { avatar: "📊", bg: "#d1d4f9", msgs: [
        { type: "user", text: "帮我做一个季度销售汇报PPT，10页左右" },
        { type: "ai", text: "正在生成 PPT 结构和内容……" },
        { type: "ai", text: "✅ PPT 已生成\n\n共 11 页：\n① 封面 ② 季度概览 ③ 销售数据 ④ 目标达成 ⑤ 区域分析 ⑥ 产品结构 ⑦ 客户分布 ⑧ 问题复盘 ⑨ 下季度计划 ⑩ 资源申请 ⑪ 结尾\n\n配色：专业蓝+橙色强调，已导出 .pptx 文件。" },
      ]}},
      { id: "image_gen", name: "营销图片批量制作", desc: "电商主图、活动海报、朋友圈配图，输入需求批量生成", demo: { avatar: "🖼️", bg: "#ffd5dc", msgs: [
        { type: "user", text: "帮我做5张双十一活动海报，主色调红色" },
        { type: "ai", text: "正在生成活动海报……" },
        { type: "ai", text: "✅ 5 张海报已生成\n\n尺寸：1080×1080（朋友圈版）+ 750×1334（手机版）\n风格：大字报冲击、节日喜庆\n每张均含：主标题 + 副标题 + 活动时间 + 品牌 Logo 位\n\n已导出 PNG，可直接投放。" },
      ]}},
      { id: "video_gen", name: "短视频自动剪辑", desc: "上传素材或给出脚本，自动完成剪辑、字幕、配乐、封面", demo: { avatar: "🎥", bg: "#c0aede", msgs: [
        { type: "user", text: "帮我把这段产品讲解录屏剪成60秒短视频" },
        { type: "ai", text: "正在分析视频素材，识别关键段落……" },
        { type: "ai", text: "✅ 视频剪辑完成\n\n时长：58秒\n· 保留：核心功能演示 + 用户价值点\n· 删除：重复操作、停顿、口误\n· 已添加：字幕、背景音乐、开场动画\n· 封面：已截取最佳帧\n\n已导出 1080P MP4，适配抖音/视频号/B站。" },
      ]}},
    ],
  },
  {
    group: "数据采集 & 监控",
    skills: [
      { id: "price_monitor", name: "竞品价格监控", desc: "每日自动抓取京东/淘宝/亚马逊竞品价格，异动立即预警", demo: { avatar: "📡", bg: "#d1d4f9", msgs: [
        { type: "user", text: "监控一下竞争对手的最新定价" },
        { type: "ai", text: "正在扫描 3 个竞品平台……" },
        { type: "ai", text: "✅ 扫描完成\n\n📊 发现 2 处变动：\n· A品牌 旗舰版 ¥299→¥269（-10%）\n· B品牌 新增「企业版」¥599/月\n\n💡 A品牌降价可能是清库存信号，是否同步调整你的定价策略？" },
      ]}},
      { id: "news_crawl", name: "行业资讯每日抓取", desc: "政策/招标/新闻每日汇总，自动推送飞书/企微/邮件", demo: { avatar: "📰", bg: "#b6e3f4", msgs: [
        { type: "user", text: "帮我看看今天有没有新的行业政策" },
        { type: "ai", text: "正在检索工信部、行业协会等 12 个来源……" },
        { type: "ai", text: "✅ 今日摘要\n\n📋 发现 3 条相关内容：\n1. 《数字经济促进条例》征求意见稿发布\n2. 某省新增 AI 产业补贴申报通道\n3. 行业标准更新：数据安全合规新要求\n\n已整理为摘要推送至企微群。" },
      ]}},
      { id: "social_monitor", name: "品牌舆情监控", desc: "品牌/产品相关社媒提及实时追踪，负面内容立即告警", demo: { avatar: "🔍", bg: "#ffd5dc", msgs: [
        { type: "user", text: "有没有关于我们品牌的负面评论？" },
        { type: "ai", text: "正在扫描微博、小红书、抖音、知乎……" },
        { type: "ai", text: "✅ 过去 24 小时扫描完成\n\n🟢 正面提及：47 条\n🟡 中性：23 条\n🔴 负面：2 条（已标记）\n\n已推送至客服主管，建议 2 小时内回复处理。" },
      ]}},
      { id: "talent_search", name: "招聘简历自动筛选", desc: "从 Boss/智联/猎聘抓取简历，按条件自动评分排序", demo: { avatar: "👤", bg: "#c0aede", msgs: [
        { type: "user", text: "帮我筛选一下投来的运营岗位简历" },
        { type: "ai", text: "正在分析 86 份简历，按岗位要求评分……" },
        { type: "ai", text: "✅ 筛选完成\n\n共分析 86 份：\n🔥 强烈推荐：8 份（匹配度 90%+）\n✅ 建议面试：21 份（匹配度 70-90%）\n❌ 不符合：57 份\n\n推荐简历已整理为表格，含评分理由。" },
      ]}},
    ],
  },
  {
    group: "系统操作 & 自动化录入",
    skills: [
      { id: "erp_entry", name: "ERP/OA 自动录入", desc: "登录公司内网系统，批量录入/更新数据，告别手工操作", demo: { avatar: "🏢", bg: "#c0aede", msgs: [
        { type: "user", text: "把今天的销售报表数据录入到 ERP" },
        { type: "ai", text: "正在登录公司内网 ERP……" },
        { type: "ai", text: "✅ 录入完成\n\n共处理 47 条记录：\n· 新增订单：32 条\n· 更新订单：15 条\n· 跳过重复：0 条\n\n录入报告已发送至您的邮箱。" },
      ]}},
      { id: "crm_update", name: "CRM 客户跟进自动化", desc: "客户信息录入、跟进提醒、商机状态自动更新同步", demo: { avatar: "👥", bg: "#b6e3f4", msgs: [
        { type: "user", text: "把本周新签的 5 个客户录入 CRM" },
        { type: "ai", text: "正在登录 CRM 系统……" },
        { type: "ai", text: "✅ 已完成\n\n5 个新客户档案已创建：\n· 跟进提醒：7天后\n· 商机阶段：谈判中\n· 负责人已分配\n\n是否同时发送欢迎短信给客户？" },
      ]}},
      { id: "report_gen", name: "每日/周报自动生成", desc: "从多系统拉取数据，自动生成日报/周报并推送至指定渠道", demo: { avatar: "📈", bg: "#d1d4f9", msgs: [
        { type: "user", text: "生成本周的销售汇总报告" },
        { type: "ai", text: "正在从 ERP、CRM、电商后台拉取数据……" },
        { type: "ai", text: "✅ 本周销售报告已生成\n\n📊 核心数据：\n· 总销售额：¥284,600（↑12%）\n· 新增客户：23 家\n· 成单率：34%\n\nPDF 已发送至管理层企微，Excel 同步至共享文件夹。" },
      ]}},
      { id: "invoice_process", name: "发票报销自动处理", desc: "扫描发票自动识别金额/类目，填写报销单，提交审批流", demo: { avatar: "🧾", bg: "#ffdfbf", msgs: [
        { type: "user", text: "帮我处理这个月的差旅发票" },
        { type: "ai", text: "正在识别 23 张发票信息……" },
        { type: "ai", text: "✅ 发票处理完成\n\n共识别 23 张：\n· 交通费：¥3,240\n· 住宿费：¥5,600\n· 餐饮费：¥1,180\n总计：¥10,020\n\n报销单已自动填写，提交审批中……已发送至财务主管。" },
      ]}},
    ],
  },
  {
    group: "获客 & 销售助手",
    skills: [
      { id: "email_outreach", name: "邮件自动外联", desc: "潜客筛选、个性化邮件撰写、跟进序列自动执行", demo: { avatar: "📧", bg: "#c0aede", msgs: [
        { type: "user", text: "给上周展会名片上的100个客户发开发信" },
        { type: "ai", text: "正在读取名片信息，分析客户行业和职位……" },
        { type: "ai", text: "✅ 外联任务已完成\n\n📊 发送详情：\n· 已发送：98 封（2 封邮箱无效）\n· 个性化变量：姓名/公司/行业痛点\n· 跟进序列：3/7/14 天自动提醒\n\n24 小时内将推送回复率报告。" },
      ]}},
      { id: "lead_qualify", name: "线索自动评分 & 分配", desc: "官网/表单/广告线索自动评分，按规则分配给对应销售", demo: { avatar: "🎯", bg: "#b6e3f4", msgs: [
        { type: "user", text: "今天新来了32条线索，帮我处理一下" },
        { type: "ai", text: "正在分析线索来源、行为数据和画像……" },
        { type: "ai", text: "✅ 线索处理完成\n\n🔥 高意向（A级）：8 条 → 已分配给高级销售\n✅ 中意向（B级）：15 条 → 已加入培育序列\n❄️ 低意向（C级）：9 条 → 进入长期跟进池\n\n所有线索已同步至 CRM。" },
      ]}},
      { id: "customer_service", name: "智能客服自动回复", desc: "常见问题自动回复，复杂问题转人工，支持微信/企微/淘宝", demo: { avatar: "🤖", bg: "#d1d4f9", msgs: [
        { type: "user", text: "今天有多少客户咨询没有及时回复？" },
        { type: "ai", text: "正在统计各平台未回复消息……" },
        { type: "ai", text: "✅ 今日客服数据\n\n总咨询：156 条\n· 自动回复解决：134 条（86%）\n· 转人工处理：22 条\n· 平均响应时间：8 秒\n\n未回复超 10 分钟提醒已推送给值班客服。" },
      ]}},
    ],
  },
  {
    group: "文件 & 流程自动化",
    skills: [
      { id: "contract_process", name: "合同文件管理", desc: "合同信息提取、批量归档、到期提醒、审批流自动触发", demo: { avatar: "📄", bg: "#ffd5dc", msgs: [
        { type: "user", text: "整理一下今年签的合同，哪些快到期了？" },
        { type: "ai", text: "正在扫描合同文件夹，提取关键信息……" },
        { type: "ai", text: "✅ 合同扫描完成\n\n📋 共扫描 47 份：\n🔴 30天内到期：5 份（提醒已发）\n🟡 60天内到期：8 份\n🟢 正常履行中：34 份\n\n到期提醒已加入日历，续签提案已发给负责人。" },
      ]}},
      { id: "data_pipeline", name: "多平台数据整合", desc: "多源数据采集→清洗→去重→导入，全流程自动化处理", demo: { avatar: "⚙️", bg: "#b6e3f4", msgs: [
        { type: "user", text: "处理一下这个月从三个平台导出的订单数据" },
        { type: "ai", text: "正在合并 3 个平台数据源，执行清洗规则……" },
        { type: "ai", text: "✅ 数据处理完成\n\n📊 处理结果：\n· 原始记录：4,283 条\n· 去重后：4,201 条（删除 82 条重复）\n· 格式统一：日期/金额/SKU 已标准化\n· 已导入 ERP\n\n处理日志已保存。" },
      ]}},
      { id: "meeting_minutes", name: "会议纪要自动生成", desc: "录音上传后自动转写、提炼要点、生成待办清单并分发", demo: { avatar: "🎙️", bg: "#c0aede", msgs: [
        { type: "user", text: "帮我整理今天下午的产品评审会议记录" },
        { type: "ai", text: "正在转写录音，识别发言人……" },
        { type: "ai", text: "✅ 会议纪要已生成\n\n📋 核心决策：3 项\n✅ 待办事项：7 条（已按负责人分配）\n📅 下次会议：已加入日历\n\n纪要已发送至所有与会人员企微，待办已同步至项目管理工具。" },
      ]}},
      { id: "translate_doc", name: "文档批量翻译", desc: "Word/PDF/Excel 文档一键翻译，保留原始排版格式", demo: { avatar: "🌐", bg: "#b6e3f4", msgs: [
        { type: "user", text: "帮我把这份50页的英文合同翻译成中文" },
        { type: "ai", text: "正在翻译文档，保留原始格式……" },
        { type: "ai", text: "✅ 翻译完成\n\n📄 共翻译 50 页，12,400 词\n· 保留原始排版、表格、页眉页脚\n· 专业术语：法律/合同用语已标准化\n· 存疑词汇：3 处已标注供人工复核\n\n中文版 Word 已生成。" },
      ]}},
      { id: "resume_screen", name: "简历批量筛选", desc: "上传 JD，自动扫描简历库，按匹配度评分排序输出", demo: { avatar: "📋", bg: "#ffdfbf", msgs: [
        { type: "user", text: "帮我从100份简历里挑出适合运营总监的候选人" },
        { type: "ai", text: "正在解析 JD 要求，扫描简历库……" },
        { type: "ai", text: "✅ 筛选完成\n\n共分析 100 份：\n🔥 强烈推荐：6 份（匹配度 90%+）\n✅ 建议面试：18 份（70–90%）\n❌ 不符合：76 份\n\n推荐简历已导出，附评分理由，可直接发给用人部门。" },
      ]}},
    ],
  },
  {
    group: "电商运营 & 店铺管理",
    skills: [
      { id: "product_listing", name: "商品详情页自动生成", desc: "输入产品参数，自动生成标题、卖点、详情文案，适配淘宝/京东/拼多多", demo: { avatar: "🛍️", bg: "#ffd5dc", msgs: [
        { type: "user", text: "帮我写一款蓝牙耳机的详情页文案" },
        { type: "ai", text: "正在分析产品卖点，匹配平台规则……" },
        { type: "ai", text: "✅ 详情页已生成\n\n📝 标题（30字）：「2024新款真无线蓝牙耳机降噪运动防水超长续航」\n⭐ 核心卖点：5条（已按流量词优化）\n📄 详情文案：1,800字，含场景图文案\n🏷️ 关键词标签：28个\n\n已导出，可直接复制上架。" },
      ]}},
      { id: "review_reply", name: "评价自动回复", desc: "店铺好评、中差评自动生成个性化回复，维护店铺口碑", demo: { avatar: "⭐", bg: "#d1d4f9", msgs: [
        { type: "user", text: "帮我回复今天的50条买家评价" },
        { type: "ai", text: "正在分析评价内容，生成个性化回复……" },
        { type: "ai", text: "✅ 50 条评价已回复\n\n好评（43条）：感谢型+引导复购\n中评（5条）：致歉+补偿方案\n差评（2条）：已标记，建议人工介入\n\n平均回复时间从 4 小时压缩至 3 分钟。" },
      ]}},
      { id: "inventory_alert", name: "库存预警 & 补货建议", desc: "监控库存水位，滞销/断货风险提前预警，自动生成补货单", demo: { avatar: "📦", bg: "#c0aede", msgs: [
        { type: "user", text: "检查一下最近的库存情况" },
        { type: "ai", text: "正在拉取仓库系统数据……" },
        { type: "ai", text: "✅ 库存预警报告\n\n🔴 紧急补货（3天内断货）：4 个 SKU\n🟡 建议补货（7天内）：11 个 SKU\n🟢 库存充足：86 个 SKU\n\n补货清单已生成，是否直接发送给供应商？" },
      ]}},
      { id: "ad_report", name: "广告投放数据分析", desc: "汇总直通车/巨量/朋友圈广告数据，自动生成优化建议", demo: { avatar: "📈", bg: "#b6e3f4", msgs: [
        { type: "user", text: "分析一下本周的广告投放效果" },
        { type: "ai", text: "正在拉取各平台广告数据……" },
        { type: "ai", text: "✅ 本周广告分析报告\n\n💰 总消耗：¥28,400\nROI：3.2（行业均值 2.1）\n\n📊 分平台：\n· 直通车：ROI 4.1 ✅ 建议加预算\n· 抖音信息流：ROI 1.8 ⚠️ 建议暂停低效计划\n\n优化建议已生成 3 条操作指令。" },
      ]}},
      { id: "order_process", name: "订单异常自动处理", desc: "超时未付、退款申请、发货延误等异常订单自动识别并处理", demo: { avatar: "🔔", bg: "#ffdfbf", msgs: [
        { type: "user", text: "今天有没有需要处理的异常订单？" },
        { type: "ai", text: "正在扫描今日订单状态……" },
        { type: "ai", text: "✅ 异常订单处理完成\n\n🔴 退款申请：7 单（已按规则自动通过 5 单，2 单需人工）\n🟡 超时未发货：3 单（已催仓库并通知买家）\n🟢 超时未付款：12 单（已自动发送提醒短信）\n\n今日客诉风险已降低。" },
      ]}},
    ],
  },
  {
    group: "财务 & 法务辅助",
    skills: [
      { id: "bookkeeping", name: "记账 & 账单对账", desc: "银行流水、发票、收款记录自动对账，生成月度财务报表", demo: { avatar: "💰", bg: "#b6e3f4", msgs: [
        { type: "user", text: "帮我对一下上个月的账单" },
        { type: "ai", text: "正在导入银行流水和发票数据……" },
        { type: "ai", text: "✅ 对账完成\n\n上月收入：¥486,200\n上月支出：¥312,700\n净利润：¥173,500\n\n⚠️ 发现 2 笔未匹配账目（共 ¥8,400），已标注供财务复核。\n\n月度报表已生成 Excel 版。" },
      ]}},
      { id: "tax_prepare", name: "税务报表辅助整理", desc: "自动汇总增值税、所得税申报所需数据，生成申报辅助表", demo: { avatar: "🧾", bg: "#ffd5dc", msgs: [
        { type: "user", text: "帮我准备本月的增值税申报数据" },
        { type: "ai", text: "正在汇总本月销售、进项发票数据……" },
        { type: "ai", text: "✅ 申报数据已整理\n\n本月销项税额：¥42,300\n本月进项税额：¥28,700\n应缴税额：¥13,600\n\n📋 申报表已生成，数据已按税务局格式填写，可直接导入电子税务局。" },
      ]}},
      { id: "contract_draft", name: "合同模板自动生成", desc: "输入合作方信息和条款要点，自动生成合规合同初稿", demo: { avatar: "📝", bg: "#c0aede", msgs: [
        { type: "user", text: "帮我起草一份软件开发服务合同" },
        { type: "ai", text: "正在生成合同框架，套用标准条款……" },
        { type: "ai", text: "✅ 合同初稿已生成\n\n共 18 条款，包含：\n· 服务范围 & 交付标准\n· 付款方式 & 里程碑节点\n· 知识产权归属\n· 保密条款\n· 违约责任\n\n已标注 3 处需双方协商的条款，建议法务审核后签署。" },
      ]}},
    ],
  },
];

type DemoMsg = { type: string; text: string };

function PhoneDemo({ msgs, avatar, bg, name }: { msgs: DemoMsg[]; avatar: string; bg: string; name: string }) {
  const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgsRef = useRef<HTMLDivElement>(null);

  const play = useCallback(() => {
    setVisibleMsgs([]);
    setShowTyping(false);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    let delay = 300;
    msgs.forEach((msg, i) => {
      if (i > 0) {
        const t1 = setTimeout(() => setShowTyping(true), delay);
        timers.current.push(t1);
        delay += msg.type === 'ai' ? 1000 : 500;
      }
      const t2 = setTimeout(() => {
        setShowTyping(false);
        setVisibleMsgs(prev => [...prev, i]);
      }, delay);
      timers.current.push(t2);
      delay += msg.type === 'ai' ? 1800 : 800;
    });
  }, [msgs]);

  useEffect(() => { play(); return () => timers.current.forEach(clearTimeout); }, [play]);
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [visibleMsgs, showTyping]);

  return (
    <div style={{
      width: 280, background: 'linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 100%)',
      borderRadius: 44, padding: 12,
      boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.5)',
      flexShrink: 0,
    }}>
      <div style={{ background: '#000', borderRadius: 34, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 520 }}>
        <div style={{ background: '#000', padding: '10px 18px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: '-apple-system,sans-serif' }}>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="5" width="3" height="7" rx="1"/><rect x="9" y="2.5" width="3" height="9.5" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <div style={{ width: 22, height: 11, border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: 2.5, padding: 1.5 }}>
                <div style={{ background: '#fff', borderRadius: 1, height: '100%', width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: 90, height: 26, background: '#000', borderRadius: 20, margin: '0 auto 4px', flexShrink: 0 }} />
        <div style={{ background: '#F8F2ED', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '0 0 32px 32px' }}>
          <div style={{ background: '#fff', padding: '8px 12px', borderBottom: '1px solid rgba(42,31,25,0.08)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{avatar}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2A1F19', fontFamily: "'Manrope',sans-serif" }}>{name}</div>
              <div style={{ fontSize: 10, color: '#22c55e', fontFamily: "'Manrope',sans-serif", display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ width: 5, height: 5, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />运行中
              </div>
            </div>
          </div>
          <div ref={msgsRef} style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 7, overflowY: 'auto', scrollBehavior: 'smooth' }}>
            {msgs.map((msg, i) => (
              visibleMsgs.includes(i) && (
                <div key={i} style={{
                  maxWidth: '82%', padding: '8px 12px', borderRadius: 14, fontSize: 12, lineHeight: 1.5,
                  fontFamily: "'Manrope',sans-serif", whiteSpace: 'pre-line',
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.type === 'user' ? '#E65C46' : '#fff',
                  color: msg.type === 'user' ? '#fff' : '#2A1F19',
                  borderBottomRightRadius: msg.type === 'user' ? 4 : 14,
                  borderBottomLeftRadius: msg.type === 'ai' ? 4 : 14,
                  boxShadow: msg.type === 'ai' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  opacity: 1, animation: 'fadeUp 0.3s ease',
                }}>
                  {msg.text}
                </div>
              )
            ))}
            {showTyping && (
              <div style={{ display: 'flex', gap: 3, alignItems: 'center', padding: '8px 12px', background: '#fff', borderRadius: 14, borderBottomLeftRadius: 4, width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{ width: 5, height: 5, background: '#9e8074', borderRadius: '50%', display: 'block', animation: `bounce 1.2s ${d}s infinite` }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '6px 10px 10px', flexShrink: 0 }}>
            <button onClick={play} style={{ width: '100%', background: 'rgba(230,92,70,0.1)', border: 'none', borderRadius: 8, padding: '6px 0', fontSize: 11, fontWeight: 700, color: '#E65C46', cursor: 'pointer', fontFamily: "'Manrope',sans-serif" }}>
              ▶ 重播演示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssemblePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [demoSkill, setDemoSkill] = useState<null | { msgs: DemoMsg[]; avatar: string; bg: string; name: string }>(null);
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState('');

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSkills = SKILL_GROUPS.flatMap(g => g.skills);
  const selectedSkills = allSkills.filter(s => selected.has(s.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <style>{clawStyles}{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }
        .assemble-skill-card {
          background: #fff;
          border: 1.5px solid rgba(42,31,25,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          user-select: none;
        }
        .assemble-skill-card:hover { border-color: rgba(230,92,70,0.4); box-shadow: 0 4px 16px rgba(42,31,25,0.08); }
        .assemble-skill-card.selected { border-color: #E65C46; background: rgba(230,92,70,0.04); box-shadow: 0 4px 16px rgba(230,92,70,0.15); }
        .assemble-checkbox {
          width: 20px; height: 20px; border-radius: 6px;
          border: 2px solid rgba(42,31,25,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.15s;
          background: #fff;
        }
        .assemble-skill-card.selected .assemble-checkbox {
          background: #E65C46; border-color: #E65C46;
        }
        .assemble-demo-btn {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700; color: #E65C46;
          background: rgba(230,92,70,0.08); border: 1px solid rgba(230,92,70,0.2);
          border-radius: 100px; padding: 3px 10px; cursor: pointer;
          font-family: 'Manrope', sans-serif; transition: background 0.15s;
          align-self: flex-start;
        }
        .assemble-demo-btn:hover { background: rgba(230,92,70,0.15); }
        .assemble-summary {
          position: sticky;
          top: 72px;
          background: #fff;
          border: 1.5px solid rgba(42,31,25,0.1);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(42,31,25,0.08);
          align-self: flex-start;
        }
        .demo-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div className="claw-page">
        <ClawNav />

        <main>
          {/* Hero */}
          <section style={{ padding: '64px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
            <h1 className="claw-h1">
              像搭积木一样，五分钟组装好你的AI龙虾，<br /><span className="claw-accent">微信扫码绑定就可以马上开始工作</span>
            </h1>
            <p className="claw-lead" style={{ maxWidth: 620 }}>
              勾选你需要的技能模块，我们立即为你启动一只定制龙虾，当天交付，马上上岗。
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              {['⚡ 当天交付', '🔧 免费调试', '📦 按需组合', '🔄 自动版本升级'].map(tag => (
                <span key={tag} style={{ fontSize: 13, fontWeight: 600, color: '#6B5549', background: '#fff', border: '1px solid rgba(42,31,25,0.1)', borderRadius: 100, padding: '5px 14px' }}>{tag}</span>
              ))}
            </div>
          </section>

          <hr className="claw-divider" />

          {/* Main layout */}
          <section style={{ padding: '40px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

              {/* Left: skill groups */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {SKILL_GROUPS.map((group, gi) => (
                  <div key={group.group}>
                    <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 20, fontWeight: 400, color: '#2A1F19', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22, fontWeight: 400, color: '#2A1F19', fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
                        {['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.'][gi]}
                      </span>
                      {group.group}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {group.skills.map(skill => (
                        <div
                          key={skill.id}
                          className={`assemble-skill-card${selected.has(skill.id) ? ' selected' : ''}`}
                          onClick={() => toggle(skill.id)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                        >
                          <div className="assemble-checkbox" style={{ flexShrink: 0 }}>
                            {selected.has(skill.id) && <CheckCircle2 size={12} color="#fff" strokeWidth={3} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 14, fontWeight: 700, color: '#2A1F19' }}>
                              {skill.name}
                            </span>
                            <span style={{ fontSize: 12, color: '#9e8074', marginLeft: 8 }}>{skill.desc}</span>
                          </div>
                          <button
                            className="assemble-demo-btn"
                            style={{ flexShrink: 0 }}
                            onClick={e => { e.stopPropagation(); setDemoSkill({ ...skill.demo, name: skill.name }); }}
                          >
                            ▶ 演示
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: summary */}
              <div className="assemble-summary">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Zap size={18} style={{ color: '#E65C46' }} />
                  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 17, fontWeight: 800, color: '#2A1F19' }}>
                    你的龙虾配置
                  </span>
                </div>

                {selected.size === 0 ? (
                  <p style={{ fontSize: 13, color: '#9e8074', margin: '0 0 20px', lineHeight: 1.6 }}>
                    还没有选择任何技能。<br />从左侧勾选你需要的模块。
                  </p>
                ) : (
                  <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedSkills.map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 12px', background: 'rgba(230,92,70,0.05)', borderRadius: 10, border: '1px solid rgba(230,92,70,0.15)' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#2A1F19' }}>{s.name}</span>
                        <button onClick={() => toggle(s.id)} style={{ fontSize: 16, lineHeight: 1, color: '#9e8074', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: '1px solid rgba(42,31,25,0.08)', paddingTop: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B5549', marginBottom: 6 }}>
                    <span>已选技能</span><span style={{ fontWeight: 700, color: '#2A1F19' }}>{selected.size} 个</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B5549' }}>
                    <span>交付时间</span><span style={{ fontWeight: 700, color: '#4a9e6b' }}>当天交付</span>
                  </div>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label className="claw-form-label">联系方式（微信/手机/邮箱）</label>
                    <input
                      required
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      placeholder="方便联系的方式"
                      className="claw-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    <button
                      type="submit"
                      disabled={selected.size === 0}
                      className="claw-btn-primary"
                      style={{
                        width: '100%', padding: '12px 0', fontSize: 15, fontWeight: 700,
                        border: 'none', cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
                        borderRadius: 10, opacity: selected.size === 0 ? 0.5 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <Zap size={15} /> 立即启动龙虾
                    </button>
                    {selected.size === 0 && (
                      <p style={{ fontSize: 12, color: '#9e8074', textAlign: 'center', margin: 0 }}>请先选择至少一个技能</p>
                    )}
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <CheckCircle2 size={40} style={{ color: '#4a9e6b', marginBottom: 12 }} />
                    <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 17, fontWeight: 800, color: '#2A1F19', marginBottom: 6 }}>
                      龙虾启动中！
                    </div>
                    <p style={{ fontSize: 13, color: '#6B5549', margin: 0 }}>
                      我们会在 2 小时内联系你，确认配置并安排交付。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Phone demo modal */}
        {demoSkill && (
          <div className="demo-overlay" onClick={() => setDemoSkill(null)}>
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
              <button onClick={() => setDemoSkill(null)} style={{
                position: 'absolute', top: -14, right: -14, width: 32, height: 32,
                borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#2A1F19', zIndex: 1,
              }}>×</button>
              <PhoneDemo
                key={demoSkill.name}
                msgs={demoSkill.msgs}
                avatar={demoSkill.avatar}
                bg={demoSkill.bg}
                name={demoSkill.name}
              />
            </div>
          </div>
        )}

        <ClawFooter />
      </div>
    </>
  );
}
