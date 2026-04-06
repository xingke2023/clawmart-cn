mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: clawmart
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('clawmart-cache-livewire-rate-limiter:6adb6a161d7b23738ff7f97261b302e584935c58','i:1;',1775376201),('clawmart-cache-livewire-rate-limiter:6adb6a161d7b23738ff7f97261b302e584935c58:timer','i:1775376201;',1775376201);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `industry_solutions`
--

DROP TABLE IF EXISTS `industry_solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `industry_solutions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `industry_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emoji` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 0xF09F8FAD,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pain_points` json NOT NULL,
  `target_users` json NOT NULL,
  `modules` json NOT NULL,
  `keywords` json NOT NULL,
  `listing_id` bigint unsigned DEFAULT NULL,
  `status` enum('pending','generating','done','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `generation_error` text COLLATE utf8mb4_unicode_ci,
  `generated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `industry_solutions_industry_key_unique` (`industry_key`),
  KEY `industry_solutions_listing_id_foreign` (`listing_id`),
  CONSTRAINT `industry_solutions_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `industry_solutions`
--

LOCK TABLES `industry_solutions` WRITE;
/*!40000 ALTER TABLE `industry_solutions` DISABLE KEYS */;
INSERT INTO `industry_solutions` VALUES (1,'fresh_market','生鲜门店','🥦','专为生鲜连锁门店打造的全链路 AI 经营系统','[\"规格混乱，整进零出难以对账\", \"商品品类和价格变化快\", \"员工忙碌，无暇录入数据\", \"损耗高，临期处理不及时\"]','[\"生鲜连锁门店店长\", \"生鲜超市运营总监\", \"农贸市场档主\", \"社区生鲜买手店\"]','[\"AI 店长助手（语音/拍照上报）\", \"商品库与实时库存系统\", \"AI 智能下单预测\", \"AI 促销清货引擎\", \"竞品情报系统\", \"财务支出智能管理\", \"人事人才库\", \"多维数据看板\", \"权限管理中心\"]','[\"生鲜\", \"蔬菜\", \"水果\", \"门店\", \"库存\", \"损耗\", \"进货\", \"促销\"]',NULL,'done',NULL,'2026-03-24 09:31:11','2026-03-24 09:31:11','2026-03-24 09:31:11'),(2,'restaurant_chain','餐饮连锁','🍜','覆盖点单、备料、出餐、复盘的餐饮全链路 AI 管理系统','[\"食材备货难以精准，浪费严重\", \"多门店排班和人力成本难管控\", \"菜单定价缺乏数据支撑\", \"外卖平台评价响应滞后\"]','[\"餐饮连锁运营总监\", \"单店店长\", \"中央厨房管理员\", \"餐饮加盟主\"]','[\"AI 备料预测（历史+节假日因子）\", \"智能排班系统\", \"菜单定价优化建议\", \"外卖平台评论自动回复\", \"食材供应商管理\", \"每日经营复盘报告\", \"多门店数据看板\"]','[\"餐饮\", \"餐厅\", \"菜单\", \"备料\", \"外卖\", \"排班\", \"食材\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(3,'retail_clothing','服装零售','👗','覆盖选款、陈列、促销到库存清仓的服装零售 AI 助手','[\"选款依赖买手经验，新款滞销风险高\", \"库存积压、尾货处理困难\", \"导购转化率低\", \"季节性促销节奏难把控\"]','[\"服装零售店长\", \"买手\", \"陈列师\", \"服装品牌运营\"]','[\"AI 选款建议（基于销售数据+趋势）\", \"智能陈列方案生成\", \"尾货清仓促销策略\", \"导购话术训练助手\", \"库存周转率分析\", \"季节换季预警\", \"竞品款式情报\"]','[\"服装\", \"零售\", \"选款\", \"库存\", \"尾货\", \"导购\", \"陈列\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(4,'education_center','教育培训机构','🎓','从招生到续费，覆盖教培机构全运营周期的 AI 管理中台','[\"招生转化漏斗不透明\", \"课程排期和师资调配低效\", \"学员学习效果跟进靠人工\", \"续费率低，流失预警缺失\"]','[\"教培机构校长\", \"招生顾问\", \"教务主任\", \"K12 培训机构运营\"]','[\"AI 招生线索评分与跟进\", \"智能排课系统\", \"学员学情分析报告\", \"续费预警与挽留策略\", \"课后作业批改辅助\", \"师资绩效数据看板\", \"家长沟通话术助手\"]','[\"教育\", \"培训\", \"招生\", \"课程\", \"学员\", \"续费\", \"作业\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(5,'beauty_salon','美容美发门店','💇','覆盖预约、服务、复购的美容美发连锁 AI 管家','[\"预约管理混乱，爽约率高\", \"技师绩效难以量化\", \"产品销售转化依赖个人能力\", \"老客户流失没有预警\"]','[\"美容院/发廊店长\", \"美业连锁运营\", \"美容顾问\", \"美甲店主\"]','[\"智能预约与提醒系统\", \"AI 客户画像与复购预测\", \"技师绩效分析看板\", \"产品推荐话术生成\", \"会员积分与活动策划\", \"爽约风险预警\", \"服务后评价自动收集\"]','[\"美容\", \"美发\", \"预约\", \"技师\", \"会员\", \"复购\", \"美甲\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(6,'clinic','诊所 / 口腔门诊','🦷','为中小型诊所打造的患者管理与运营效率 AI 系统','[\"患者预约和复诊提醒靠人工\", \"病历和耗材记录混乱\", \"患者流失率高，复诊召回困难\", \"医保结算和财务核算繁琐\"]','[\"口腔诊所院长\", \"全科诊所管理者\", \"前台护士长\", \"连锁医疗机构运营\"]','[\"智能预约与复诊提醒\", \"患者档案 AI 管理\", \"耗材库存预警\", \"患者召回话术生成\", \"治疗方案费用自动核算\", \"医生绩效看板\", \"差评预警与处理建议\"]','[\"诊所\", \"口腔\", \"患者\", \"复诊\", \"预约\", \"耗材\", \"病历\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(7,'gym','健身房 / 瑜伽馆','💪','从获客到留存，覆盖健身馆全周期的 AI 运营助手','[\"私教销售转化率低\", \"会员续费到期流失无预警\", \"场馆排课利用率低\", \"员工提成核算复杂易出错\"]','[\"健身房馆长\", \"私教主管\", \"瑜伽馆运营\", \"连锁健身品牌运营总监\"]','[\"会员到期续费预警与话术\", \"私教课程销售漏斗分析\", \"智能排课与场地利用优化\", \"员工提成自动核算\", \"AI 训练计划生成\", \"新会员体测报告自动生成\", \"活动策划与推送助手\"]','[\"健身\", \"瑜伽\", \"会员\", \"私教\", \"续费\", \"排课\", \"体测\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(8,'property_management','物业管理','🏢','覆盖报修、收费、巡检的智慧物业 AI 管理平台','[\"业主报修响应慢，满意度低\", \"物业费催缴靠人工，欠费难追\", \"公共设施巡检记录不规范\", \"多楼盘数据分散，难以统筹\"]','[\"物业项目经理\", \"物业公司总部运营\", \"客服主管\", \"设施设备负责人\"]','[\"AI 报修工单自动分发\", \"物业费智能催缴系统\", \"设施巡检语音上报\", \"业主满意度分析\", \"多楼盘数据汇总看板\", \"供应商管理与费用核算\", \"紧急事件预警与处理流程\"]','[\"物业\", \"报修\", \"业主\", \"收费\", \"巡检\", \"楼盘\", \"设施\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(9,'logistics_warehouse','仓储物流','📦','从入库到配送，覆盖仓储物流全流程的 AI 调度系统','[\"库位混乱，拣货效率低\", \"配送路线依赖老司机经验\", \"货损追责困难\", \"旺季人力调配混乱\"]','[\"仓库主管\", \"物流配送负责人\", \"供应链经理\", \"电商仓储运营\"]','[\"AI 库位优化建议\", \"智能拣货路径规划\", \"配送路线 AI 优化\", \"货损记录与责任追溯\", \"旺季人力需求预测\", \"入出库数据看板\", \"供应商到货准时率分析\"]','[\"仓储\", \"物流\", \"配送\", \"库位\", \"拣货\", \"货损\", \"入库\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(10,'hotel','酒店 / 民宿','🏨','覆盖预订、入住、清洁到复购的酒店运营 AI 助手','[\"多平台订单管理混乱\", \"客房清洁调度低效\", \"差评响应不及时\", \"淡季定价策略缺乏数据支撑\"]','[\"酒店前厅经理\", \"民宿管家\", \"酒店集团运营总监\", \"OTA 运营专员\"]','[\"多平台订单统一管理\", \"客房清洁智能调度\", \"AI 动态定价建议\", \"差评预警与回复生成\", \"客户复购与会员召回\", \"房间状态实时看板\", \"收益管理分析报告\"]','[\"酒店\", \"民宿\", \"预订\", \"客房\", \"清洁\", \"OTA\", \"定价\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(11,'auto_repair','汽车维修 / 4S 店','🔧','从预约到交车，覆盖汽车服务门店全流程的 AI 管理系统','[\"维修工单流转靠口头传达，易出错\", \"配件库存积压或短缺\", \"客户进厂频率下降，复购难\", \"技师工时核算繁琐\"]','[\"汽修门店老板\", \"4S 店服务顾问\", \"配件库管\", \"连锁汽服运营总监\"]','[\"AI 工单自动生成与流转\", \"配件库存智能预警\", \"客户保养到期提醒\", \"技师工时自动核算\", \"维修报价 AI 辅助生成\", \"客户满意度回访\", \"门店收益分析看板\"]','[\"汽修\", \"4S\", \"配件\", \"工单\", \"保养\", \"技师\", \"维修\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(12,'ecommerce_ops','电商运营团队','🛒','覆盖选品、上架、客服到复盘的电商运营全链路 AI 助手','[\"选品依赖经验，爆款命中率低\", \"商品上架内容耗时费力\", \"售后客服压力大\", \"数据分析维度分散\"]','[\"电商运营主管\", \"天猫/京东店铺负责人\", \"跨境电商卖家\", \"品牌电商总监\"]','[\"AI 选品竞品分析\", \"商品标题和详情页生成\", \"客服话术知识库\", \"差评自动回复与预警\", \"广告投放 ROI 分析\", \"销售数据复盘报告\", \"仓库发货异常预警\"]','[\"电商\", \"选品\", \"上架\", \"客服\", \"天猫\", \"京东\", \"跨境\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(13,'kindergarten','幼儿园 / 托育机构','🧸','覆盖招生、保育、家园沟通的幼儿园 AI 运营助手','[\"招生旺季线索跟进不及时\", \"家长沟通占用大量时间\", \"儿童成长记录耗时且不规范\", \"课程安排和活动通知效率低\"]','[\"幼儿园园长\", \"招生主任\", \"班主任\", \"托育机构运营\"]','[\"招生线索 AI 跟进与评分\", \"家长通知一键群发\", \"儿童成长档案自动生成\", \"课程表智能排期\", \"食谱营养分析建议\", \"缺勤异常预警\", \"家长满意度调研\"]','[\"幼儿园\", \"托育\", \"招生\", \"家长\", \"成长\", \"保育\", \"课程\"]',NULL,'done',NULL,'2026-04-04 21:31:40','2026-03-24 09:31:11','2026-04-04 21:31:40'),(14,'real_estate_agency','房产中介','🏠','从带看到成交，覆盖房产中介全业务流程的 AI 销售系统','[\"房源录入和维护效率低\", \"客户需求匹配靠经纪人记忆\", \"带看跟进节奏混乱\", \"成交数据分析缺失\"]','[\"房产中介门店经理\", \"经纪人\", \"二手房平台运营\", \"新房销售主管\"]','[\"房源信息 AI 结构化录入\", \"客户需求智能匹配推荐\", \"带看计划自动提醒\", \"跟进话术生成\", \"合同要点风险提示\", \"经纪人绩效分析\", \"市场行情周报自动生成\"]','[\"房产\", \"中介\", \"房源\", \"带看\", \"经纪人\", \"成交\", \"租房\"]',NULL,'done',NULL,'2026-03-24 09:34:41','2026-03-24 09:31:11','2026-03-24 09:34:41'),(15,'law_firm','律所 / 法律服务','⚖️','覆盖案件管理、合同审查到客户维系的律所 AI 效率系统','[\"案件文书起草耗时\", \"合同条款风险审查靠经验\", \"客户档案和进度管理混乱\", \"业务拓展缺乏系统支持\"]','[\"律所主任律师\", \"法律顾问\", \"合规经理\", \"法律援助机构负责人\"]','[\"合同智能审查与风险标注\", \"法律文书 AI 起草助手\", \"案件进度跟踪系统\", \"法律法规检索助手\", \"客户档案管理\", \"开庭时间提醒\", \"律所收费与账期管理\"]','[\"律所\", \"法律\", \"合同\", \"案件\", \"文书\", \"合规\", \"律师\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(16,'accounting_firm','会计师事务所','📊','覆盖账务处理、税务申报到客户管理的会计 AI 效率平台','[\"重复性账务处理耗时大\", \"税务申报节点容易遗漏\", \"客户财务数据分散难汇总\", \"年审旺季人力严重不足\"]','[\"会计师事务所合伙人\", \"主办会计\", \"税务顾问\", \"中小企业财务外包服务商\"]','[\"票据 OCR 智能识别入账\", \"税务申报日历与提醒\", \"客户财报自动生成\", \"异常账务预警\", \"年审任务清单管理\", \"客户服务进度跟踪\", \"税务政策变更推送\"]','[\"会计\", \"税务\", \"财务\", \"账务\", \"申报\", \"审计\", \"票据\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(17,'pet_store','宠物店 / 宠物医院','🐾','覆盖洗护预约、诊疗记录到复购召回的宠物服务 AI 助手','[\"宠物档案记录不完整\", \"疫苗和驱虫到期提醒靠人工\", \"洗护预约调度混乱\", \"铲屎官复购率低\"]','[\"宠物店店长\", \"宠物医院院长\", \"宠物美容师\", \"连锁宠物品牌运营\"]','[\"宠物档案 AI 管理\", \"疫苗/驱虫到期智能提醒\", \"洗护预约智能调度\", \"宠物主人复购召回话术\", \"诊疗记录语音录入\", \"商品库存与销售分析\", \"节日营销活动策划\"]','[\"宠物\", \"洗护\", \"疫苗\", \"诊疗\", \"预约\", \"宠物医院\", \"美容\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(18,'construction_team','建筑 / 装修工程队','🏗️','覆盖报价、施工管理到验收的装修工程 AI 管理系统','[\"报价不透明，客户信任度低\", \"施工进度管理依赖工头口头汇报\", \"材料采购超支无预警\", \"工人工时核算复杂\"]','[\"装修公司老板\", \"项目经理\", \"工程监理\", \"家装设计师\"]','[\"AI 报价单自动生成\", \"施工进度照片上报与汇总\", \"材料采购预算预警\", \"工人工时自动核算\", \"客户验收报告生成\", \"供应商比价建议\", \"工程项目数据看板\"]','[\"装修\", \"建筑\", \"工程\", \"报价\", \"施工\", \"材料\", \"工人\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(19,'hr_agency','人力资源 / 招聘机构','👥','从简历筛选到候选人跟进，覆盖 HR 全流程的 AI 效率工具','[\"简历筛选耗时，质量参差不齐\", \"候选人跟进节奏混乱\", \"岗位需求与候选人匹配靠经验\", \"客户需求变更响应慢\"]','[\"猎头顾问\", \"HR BP\", \"招聘总监\", \"人力资源外包机构\"]','[\"简历 AI 结构化解析与标签\", \"候选人智能匹配评分\", \"面试安排自动提醒\", \"跟进话术生成\", \"岗位需求分析报告\", \"候选人 pipeline 看板\", \"客户满意度跟踪\"]','[\"HR\", \"招聘\", \"简历\", \"候选人\", \"猎头\", \"人力资源\", \"面试\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(20,'pharmacy','药店 / 连锁药房','💊','覆盖药品库存、用药提醒到会员管理的连锁药房 AI 系统','[\"近效期药品处理不及时\", \"处方药销售合规压力大\", \"会员复购召回靠人工\", \"门店药品库存不均衡\"]','[\"连锁药房运营总监\", \"药店店长\", \"驻店药师\", \"医药配送负责人\"]','[\"近效期药品预警与促销\", \"处方合规审查辅助\", \"会员用药周期提醒\", \"跨门店库存调拨建议\", \"药品进销存看板\", \"供应商采购建议\", \"健康咨询话术知识库\"]','[\"药店\", \"药房\", \"药品\", \"处方\", \"会员\", \"库存\", \"近效期\"]',NULL,'done',NULL,'2026-04-04 06:44:40','2026-03-24 09:31:11','2026-04-04 06:44:40'),(21,'coffee_tea_shop','咖啡茶饮店','☕','专为新式茶饮与咖啡门店打造的智能运营增长系统','[\"新品研发周期长，口味测试缺乏数据支撑\", \"高峰期排队流失严重，备料预估全靠经验\", \"会员复购率低，营销活动千篇一律难以留客\", \"多门店出品标准不统一，品控管理难落地\"]','[\"茶饮咖啡品牌运营总监\", \"连锁门店区域督导\", \"单店店长\"]','[\"AI 饮品销量预测与备料建议\", \"智能会员画像与精准营销\", \"出品标准 SOP 数字化管理\", \"新品口味测评数据分析\", \"高峰期排队预警与分流助手\", \"多门店经营看板\", \"顾客评价情感分析\", \"AI 爆品选品推荐\"]','[\"茶饮\", \"咖啡\", \"新品研发\", \"会员运营\", \"备料预测\", \"品控\", \"门店\", \"复购\"]',NULL,'pending',NULL,NULL,'2026-04-04 13:43:31','2026-04-04 13:43:31'),(22,'wedding_photography','婚庆影像','💍','为婚纱摄影与婚庆策划机构打造的全流程 AI 服务系统','[\"客户跟进周期长，销售话术不统一导致签单率低\", \"档期排班混乱，摄影师与场地冲突频繁\", \"后期修图量大耗时长，交片周期拖延影响口碑\", \"套餐报价复杂，销售现场难以快速出方案\"]','[\"婚纱摄影门店经理\", \"婚庆公司策划总监\", \"独立摄影师工作室主理人\"]','[\"AI 客户意向评分与跟进提醒\", \"档期智能排班与资源调度\", \"AI 辅助修图批处理工作流\", \"智能套餐报价生成器\", \"婚礼策划方案 AI 助手\", \"客户案例与风格匹配推荐\", \"好评管理与口碑传播追踪\", \"售后回访自动化流程\"]','[\"婚纱摄影\", \"婚庆\", \"档期管理\", \"修图\", \"套餐报价\", \"客户跟进\", \"策划\", \"排班\"]',NULL,'pending',NULL,NULL,'2026-04-04 13:43:31','2026-04-04 13:43:31'),(23,'gym_fitness_studio','传媒广告','📡','为中小传媒与广告公司打造的 AI 创意生产与项目管理平台','[\"提案准备耗时长，创意文案反复改稿效率低\", \"多项目并行时人员排期混乱、交付频繁延期\", \"客户报告数据整合繁琐，投放效果解读不专业\", \"新媒体内容需求量大，内部团队产能严重不足\"]','[\"广告公司创意总监\", \"品牌营销负责人\", \"新媒体运营团队负责人\", \"独立策划工作室主理人\"]','[\"AI 创意提案文档生成\", \"多项目任务排期与进度看板\", \"投放数据智能分析报告\", \"AI 短视频脚本与文案批量生产\", \"客户沟通纪要自动整理\", \"品牌素材库统一管理\", \"竞品创意监测与灵感库\", \"项目报价与合同智能生成\"]','[\"广告\", \"传媒\", \"创意\", \"文案\", \"项目管理\", \"投放分析\", \"新媒体\", \"提案\"]',NULL,'pending',NULL,NULL,'2026-04-04 13:43:31','2026-04-04 13:43:31'),(24,'industrial_manufacturing','小微制造','🏭','为中小型制造工厂打造的 AI 生产管理与质检智能化系统','[\"生产排程靠人工拍脑袋，插单频繁导致交期延误\", \"质检全靠人眼，漏检率高且记录不规范难追溯\", \"设备故障无预警，停机维修造成大量产能损失\", \"车间数据孤岛严重，管理层无法实时掌握产能与良率\"]','[\"工厂生产总监\", \"车间班组长\", \"质检主管\", \"中小企业主\"]','[\"AI 生产排程与插单优化\", \"设备故障预警与维护提醒\", \"质检记录数字化与异常预警\", \"原材料库存与采购预测\", \"生产日报自动生成\", \"工单进度实时追踪看板\", \"良率趋势分析与改善建议\", \"AI 工艺参数优化助手\"]','[\"制造\", \"生产排程\", \"质检\", \"设备管理\", \"良率\", \"工厂\", \"工单\", \"产能\"]',NULL,'pending',NULL,NULL,'2026-04-04 13:43:31','2026-04-04 13:43:31'),(25,'community_clinic_tcm','中医馆','🌿','为中医馆与国医堂打造的传统医学智能化运营与患者管理系统','[\"名医号源紧张，预约管理混乱导致患者体验差\", \"患者复诊率低，治疗周期管理与随访全靠人工\", \"中药库存品类繁多，备货不足或积压浪费严重\", \"医师经验难以沉淀，新人带教周期长且效果参差\"]','[\"中医馆经营者\", \"门诊运营主管\", \"中医师\", \"抓药与库管人员\"]','[\"智能预约与排班管理系统\", \"患者病历与体质档案管理\", \"AI 复诊提醒与随访助手\", \"中药库存智能预警与采购建议\", \"名医知识库与诊疗经验沉淀\", \"AI 健康科普内容生成\", \"患者口碑管理与评价分析\", \"营收与就诊数据经营看板\"]','[\"中医\", \"中医馆\", \"患者管理\", \"中药库存\", \"复诊\", \"随访\", \"排班\", \"知识沉淀\"]',NULL,'pending',NULL,NULL,'2026-04-04 13:43:31','2026-04-04 13:43:31');
/*!40000 ALTER TABLE `industry_solutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Claw',
  `demo_messages` json DEFAULT NULL,
  `demo_personas` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `listings_slug_unique` (`slug`),
  KEY `listings_user_id_foreign` (`user_id`),
  CONSTRAINT `listings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=430 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (343,NULL,'Davide · 前端系统架构师','davide-frontend-architect',39.00,'意大利籍高级前端架构师，10 年大厂经验。精通 React / Next.js 系统拆分、性能调优与组件库设计。能快速评审代码架构、输出可落地的重构方案，并提供完整技术决策文档。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的前端系统架构师 👨‍💻\\n专注 React/Next.js 架构评审与性能调优。有什么需要我做的？\", \"type\": \"ai\"}, {\"text\": \"我们页面加载很慢，首页有大量图片\", \"type\": \"user\"}, {\"text\": \"问题很可能出在图片加载策略上。我来做快速诊断：\\n\\n① 首屏渲染路径（SSR/CSR/ISR 策略）\\n② Bundle 体积分析（代码拆分是否合理）\\n③ 图片与资源加载策略\\n\\n建议立即执行：\\n🔧 将 <img> 全部替换为 Next.js <Image> 组件\\n🔧 启用 priority 属性给首屏图\\n\\n通常可提速 40-70%。需要我生成重构后的代码吗？\", \"type\": \"ai\"}, {\"text\": \"需要，我们用 Next.js 15\", \"type\": \"user\"}, {\"text\": \"好，已为你生成优化方案：\\n\\n\\n\\n同时建议开启 Next.js Sharp 插件做自动压缩。预计首屏 LCP 从 4.2s 降至 1.1s ⚡\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(344,NULL,'Tom · 融资经理','tom-fundraising-manager',39.00,'专注早期创业公司融资的 AI 助手。帮助创始人梳理融资逻辑、打磨 Pitch Deck、准备 Due Diligence 材料，并模拟 VC 问答场景。已协助 50+ 项目完成天使轮及 Pre-A 轮融资。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的融资经理 💼\\n专注早期融资策略、Pitch Deck 打磨与 VC 模拟问答。你们现在准备融哪轮？\", \"type\": \"ai\"}, {\"text\": \"准备天使轮，还没接触过投资人\", \"type\": \"user\"}, {\"text\": \"明白了。天使轮准备三个核心任务：\\n\\n① Pitch Deck：10-12 页，讲清楚问题、方案、市场、团队\\n② 一句话 Pitch：30 秒说清楚你是谁、解决什么问题\\n③ 目标投资人名单：匹配你的赛道，别乱投\\n\\n先帮你打磨一句话 Pitch。你们产品是做什么的？\", \"type\": \"ai\"}, {\"text\": \"我们帮中小企业用 AI 做客服自动化\", \"type\": \"user\"}, {\"text\": \"好，一句话 Pitch 初稿：\\n\\n「我们帮中小企业用 AI 替代 70% 的客服工作量，成本降低 80%，已服务 50 家付费客户。」\\n\\n接下来模拟三个 VC 必问问题：\\n\\n❓「如果腾讯做同样的事，你们怎么办？」\\n❓「你们现在 MRR 是多少，增长率如何？」\\n❓「核心团队有没有做过 Exit？」\\n\\n想先练哪个？\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(345,NULL,'Sophia · 内容营销总监','sophia-content-marketing-director',39.00,'内容营销人工智能与多代理写作流程——Grok 研究、Opus 写作、品牌声音系统。从选题调研到成稿发布，全链路自动化，输出风格统一、转化率极高的品牌内容。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的内容营销总监 ✍️\\n我负责你所有的公众号内容策划、文章撰写和发布排期。有什么需要我做的？\", \"type\": \"ai\"}, {\"text\": \"本周需要发三篇公众号，帮我想选题\", \"type\": \"user\"}, {\"text\": \"好的！根据你的行业和近期热点，推荐以下三个选题：\\n\\n① 《为什么你的团队效率低？不是因为懒，是因为这件事没做好》\\n② 《我用 AI 员工替代了一个岗位，三个月后发生了什么》\\n③ 《老板必看：2025 年最值得投入的 3 个增长渠道》\\n\\n需要我先写哪篇？\", \"type\": \"ai\"}, {\"text\": \"先写第二篇\", \"type\": \"user\"}, {\"text\": \"收到，正在撰写《我用 AI 员工替代了一个岗位》...\\n\\n开头已生成：\\n\\n「三个月前，我做了一个让团队都觉得冒险的决定——用一个 AI 员工，接管了我们的客服岗位。没想到，三个月后，客户满意度反而提高了 23%。」\\n\\n全文约 1800 字，包含数据、故事线和行动号召。是否继续生成完整版？\", \"type\": \"ai\"}, {\"text\": \"好，另外帮我想个封面标题\", \"type\": \"user\"}, {\"text\": \"封面标题备选 3 个：\\n\\n🔥「裁了一个人，省了 12 万，老板后悔没早点做」\\n💡「我偷偷用了 AI 员工 90 天，结果出乎意料」\\n📈「一个 AI，干了三个人的活——这不是未来，是现在」\\n\\n建议用第一个，点击率预计更高 🎨\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(346,NULL,'Marcus · 客服自动化专家','marcus-customer-service-automation',39.00,'专注企业客服全流程自动化。构建多轮对话工作流、智能工单分发与情绪识别系统，无缝对接 Zendesk、Intercom 等主流平台。平均将人工响应成本降低 70%，客户满意度提升至 95% 以上。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的客服自动化专家 🤖\\n专注构建多轮对话工作流与智能工单系统。你们目前客服是怎么运作的？\", \"type\": \"ai\"}, {\"text\": \"5 个客服每天处理 200+ 工单，太累了\", \"type\": \"user\"}, {\"text\": \"200+ 工单/天，5 个人处理，这个量级可以自动化 70% 以上。\\n\\n我的方案：\\n① 常见问题（退款/查单/密码重置）→ 全自动回复\\n② 复杂问题 → AI 初步分类后转人工\\n③ 情绪识别 → 差评风险工单自动优先级提升\\n\\n你们用什么客服平台？\", \"type\": \"ai\"}, {\"text\": \"用的是企业微信\", \"type\": \"user\"}, {\"text\": \"企业微信我可以对接。自动化上线后预期效果：\\n\\n✅ 人工响应量减少 65-75%\\n✅ 平均首次响应时间：15 分钟 → 30 秒\\n✅ 客户满意度预计提升 20%+\\n\\n5 个客服可缩减到 2 个，专注处理高价值问题。需要我出一份详细的自动化方案吗？\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(347,NULL,'Elena · 数据分析师','elena-data-analyst',39.00,'精通 Python、SQL 与 BI 工具的 AI 数据分析员。自动清洗原始数据、构建分析模型、生成可视化报告，并用非技术语言解读关键业务洞察。支持 Google Analytics、Mixpanel、Snowflake 等主流数据源接入。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的数据分析师 📊\\n精通 Python、SQL 与各类 BI 工具。有什么数据需要分析？\", \"type\": \"ai\"}, {\"text\": \"上个月用户流失率突然升高，不知道原因\", \"type\": \"user\"}, {\"text\": \"用户流失分析我会从这几个维度切入：\\n\\n① 流失节点定位：哪个步骤流失最多？\\n② 用户分层：哪类用户先流失？（新用户/老用户/付费用户）\\n③ 时间线对比：哪天开始上升？和产品改动对齐\\n\\n你们数据在哪里？GA、Mixpanel 还是自己的数据库？\", \"type\": \"ai\"}, {\"text\": \"我们用 Mixpanel\", \"type\": \"user\"}, {\"text\": \"连接 Mixpanel 后，我发现：\\n\\n🔍 新用户 Day-7 留存率上月从 42% 跌至 28%\\n🔍 跌幅从 11 月 18 日开始，与 App 1.3.2 版本发布同一天\\n🔍 主要流失发生在「完成首单」环节\\n\\n结论：1.3.2 版本改动了支付流程，导致结账转化率下降 33%。建议立即回滚该页面并 A/B 测试修复方案 📉\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(348,NULL,'Ryan · SEO 增长专家','ryan-seo-growth-expert',39.00,'全栈 SEO 自动化智能体。涵盖关键词研究、竞品分析、内链优化、技术 SEO 审查与外链建设全流程。结合 Ahrefs、Search Console 数据自动生成优先级行动清单，帮助网站在 90 天内实现自然流量显著增长。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的 SEO 增长专家 🔍\\n全栈 SEO 自动化，覆盖关键词研究到技术审查。你们网站目前 SEO 情况怎么样？\", \"type\": \"ai\"}, {\"text\": \"网站上线一年了，自然流量很少，没有专门做过 SEO\", \"type\": \"user\"}, {\"text\": \"一年没做 SEO，机会很大。我先做技术诊断，发现以下问题：\\n\\n❌ 43 个页面未被 Google 索引\\n❌ 页面平均加载速度 4.8s（移动端）\\n❌ 缺少结构化数据标记\\n⚠️ 核心关键词竞争度过高，需要找长尾切入口\\n\\n需要我出 90 天增长计划吗？\", \"type\": \"ai\"}, {\"text\": \"需要\", \"type\": \"user\"}, {\"text\": \"90 天 SEO 增长计划：\\n\\n📅 第 1 个月：技术修复（索引、速度、Schema）+ 关键词地图\\n📅 第 2 个月：核心页面内容优化 + 内链建设\\n📅 第 3 个月：外链获取 + 50 篇长尾词文章覆盖\\n\\n预期：自然流量提升 150-300%，首页关键词进入 Top 10 ✅\\n\\n已为你生成优先级行动清单，共 27 项任务。\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(349,NULL,'Mia · 社媒运营专家','mia-social-media-manager',39.00,'覆盖小红书、微博、抖音、Instagram 全平台的 AI 社媒运营员。自动规划内容日历、生成平台适配文案与配图提示词、分析互动数据并优化发布节奏。擅长打造品牌人设、提升粉丝粘性与自然增长。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的社媒运营专家 📱\\n覆盖小红书、微博、抖音全平台。你们现在主要运营哪个平台？\", \"type\": \"ai\"}, {\"text\": \"主要是小红书，卖护肤品，主打成分党，但涨粉很慢\", \"type\": \"user\"}, {\"text\": \"成分党赛道在小红书非常活跃！涨粉慢通常是这几个原因：\\n\\n① 账号定位不清晰，内容太杂\\n② 标题和封面不够吸引人\\n③ 发布时间没对齐平台高峰\\n\\n我的策略：\\n🎯 内容公式：「成分拆解 + 避坑指南 + 真实测评」\\n📌 爆款标题模板：「用了 X 年护肤品，这 3 个成分坑了多少人...」\\n🕐 最佳发布时间：工作日 21:00-22:00\", \"type\": \"ai\"}, {\"text\": \"帮我规划下个月的内容日历\", \"type\": \"user\"}, {\"text\": \"30 天内容日历已生成，共 20 篇：\\n\\n📅 每周一：成分深度解析（高涨粉）\\n📅 每周三：真实测评对比（高互动）\\n📅 每周五：避坑指南（高收藏）\\n📅 每周日：限时福利贴（高转化）\\n\\n每篇包含标题、封面文案、正文大纲和发布时间 🗓\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(350,NULL,'Alex · AI CEO','alex-ai-ceo',39.00,'你的 AI CEO——负责产品交付、代码管理、沟通协调、记忆一切、运营你的业务。统筹调度其他 AI 员工，追踪项目进度，处理跨部门协作，让你专注于最重要的决策。',NULL,'available','AI 角色','[{\"text\": \"你好，我是 Alex，你的 AI CEO 👔\\n负责统筹所有 AI 员工、追踪项目进度、处理跨部门协调。你现在最大的业务挑战是什么？\", \"type\": \"ai\"}, {\"text\": \"我一个人管着产品、运营、客服，完全忙不过来\", \"type\": \"user\"}, {\"text\": \"这很常见。你现在做的 80% 的事情都可以交给 AI 员工。\\n\\n我来帮你做任务分配：\\n👩‍💼 Sophia → 公众号内容（每周 3 篇）\\n📊 Elena → 数据报告（每日自动生成）\\n🤖 Marcus → 客服自动化（处理 70% 工单）\\n📱 Mia → 社媒运营（全平台覆盖）\\n\\n你只需每天 30 分钟看汇总报告，其余交给我们。\", \"type\": \"ai\"}, {\"text\": \"怎么追踪 AI 员工的工作进度？\", \"type\": \"user\"}, {\"text\": \"我每天早上 9:00 给你发《AI 员工日报》：\\n\\n📋 昨日完成事项（含各员工输出清单）\\n⚠️ 需要你决策的 2-3 件事\\n📅 今日计划 + 风险预警\\n\\n你的决策时间从每天 8 小时压缩到 30 分钟。这就是雇 AI CEO 的价值 💼\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(351,NULL,'Claire · 法律合规顾问','claire-legal-compliance',39.00,'专注企业法律合规的 AI 顾问。覆盖合同审查、隐私政策起草、劳动法合规、知识产权保护及跨境数据合规。熟悉中国、欧盟、美国三地监管框架，帮助初创企业在快速扩张中规避法律风险。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的法律合规顾问 ⚖️\\n覆盖合同审查、隐私政策、劳动法与知识产权。有什么法律问题需要我处理？\", \"type\": \"ai\"}, {\"text\": \"我们要上线 APP，收集手机号、位置和使用行为，用了微信登录和支付宝支付，需要隐私政策\", \"type\": \"user\"}, {\"text\": \"这是中高风险数据收集组合，需满足以下法规：\\n\\n📋 中国：《个人信息保护法》（PIPL）\\n📋 欧盟用户：GDPR\\n📋 苹果/安卓：应用商店审核要求\\n\\n关键合规点：\\n⚠️ 位置数据需单独弹窗二次授权\\n⚠️ 第三方 SDK（微信、支付宝）必须逐一披露\\n⚠️ 用户有权申请数据删除\", \"type\": \"ai\"}, {\"text\": \"帮我起草隐私政策\", \"type\": \"user\"}, {\"text\": \"隐私政策初稿已完成，共 2400 字，包含：\\n\\n✅ 数据收集目的与最小化原则\\n✅ 第三方 SDK 数据共享披露（微信、支付宝）\\n✅ 用户权利条款（查询/删除/撤回授权）\\n✅ 位置数据专项说明\\n✅ 未成年人保护条款\\n\\n同步为你生成了《用户服务协议》初稿。建议上线前由律师二审 ✅\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(352,NULL,'James · HR 招聘专家','james-hr-recruitment',39.00,'全流程 AI 招聘助手。自动撰写职位描述、筛选简历、设计结构化面试题库，并对候选人进行初步评估与背景调查。支持 LinkedIn、Boss 直聘等主流平台数据接入，帮助企业将平均招聘周期缩短 60%。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的 HR 招聘专家 👥\\n全流程 AI 招聘，从 JD 撰写到候选人评估。你们现在需要招什么岗位？\", \"type\": \"ai\"}, {\"text\": \"要招一个用户增长方向的运营经理，薪资 15-20k\", \"type\": \"user\"}, {\"text\": \"好，JD 已初步生成：\\n\\n📄 职位：用户增长运营经理\\n💰 薪资：15-20k · 13薪\\n📌 核心要求：\\n・有 APP 或电商平台用户增长经验\\n・熟悉 A/B 测试、漏斗分析、裂变玩法\\n・有独立负责 GMV/DAU 增长项目经验\\n\\n已同步准备 8 道结构化面试题 + 评分标准。需要发布到哪个平台？\", \"type\": \"ai\"}, {\"text\": \"发到 Boss 直聘，帮我筛简历\", \"type\": \"user\"}, {\"text\": \"已发布到 Boss 直聘，72 小时内收到 47 份简历。\\n\\n AI 筛选结果：\\n✅ 强推候选人：3 名（均有电商增长项目经验）\\n📋 可面试候选人：11 名\\n❌ 不匹配：33 名\\n\\n已为 3 名强推候选人安排了初步背调，调查报告 24 小时内完成 📋\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(353,NULL,'Linda · 财务会计专家','linda-finance-accounting',39.00,'专业 AI 财务会计助手。自动处理日常记账、发票核对、工资核算与税务申报，生成月度财务报表与现金流预测。熟悉中国会计准则与 IFRS，支持对接用友、金蝶等主流财务系统，让财务工作零出错、全透明。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的财务会计专家 💰\\n自动处理日常记账、发票核对、税务申报与财务报表。你们现在财务是怎么处理的？\", \"type\": \"ai\"}, {\"text\": \"我自己用 Excel 记账，每个月月底很混乱，大概 100 张发票\", \"type\": \"user\"}, {\"text\": \"100 张/月，完全可以自动化处理。\\n\\nExcel 手动记账有三大风险：\\n❌ 数据容易出错，难以追溯\\n❌ 无法实时看现金流\\n❌ 税务申报时容易漏项\\n\\n我的方案：\\n📷 发票 OCR 识别 → 自动分类入账\\n📊 每月自动生成利润表、现金流表\\n🧾 季度增值税申报自动预填\", \"type\": \"ai\"}, {\"text\": \"上个月的财务报表能帮我生成吗？\", \"type\": \"user\"}, {\"text\": \"已生成上月财务报表：\\n\\n💰 营业收入：¥284,600\\n📉 运营成本：¥187,300\\n✅ 净利润：¥97,300（利润率 34.2%）\\n\\n⚠️ 异常提醒：\\n・采购支出比上月增加 23%，建议核查\\n・有 3 张发票金额异常，已标记待确认\\n\\n完整报表已导出 PDF，可直接用于税务申报 📄\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(354,NULL,'Kevin · 产品经理','kevin-product-manager',39.00,'经验丰富的 AI 产品经理。负责需求拆解、PRD 撰写、用户故事梳理与优先级排序，协调研发、设计与运营团队高效协作。擅长竞品分析、MVP 定义与版本迭代规划，帮助产品从 0 到 1 快速落地。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的产品经理 📋\\n负责需求拆解、PRD 撰写与版本规划。你们现在有什么产品需求需要梳理？\", \"type\": \"ai\"}, {\"text\": \"我们要做一个用户积分系统，目标是提升复购率\", \"type\": \"user\"}, {\"text\": \"目标是提升复购，这是最常见的积分模型。核心设计：\\n\\n📝 积分获取：消费 1 元 = 10 积分，签到 +5/天\\n🎁 兑换规则：100 积分 = 1 元优惠券（满 50 元可用）\\n⏰ 有效期：12 个月，到期前 30 天提醒\\n\\n预计首单复购率提升 25-35%。需要我出完整 PRD 吗？\", \"type\": \"ai\"}, {\"text\": \"需要，同时帮我想想可能的坑\", \"type\": \"user\"}, {\"text\": \"完整 PRD 已生成，共 15 页，包含用户故事、流程图和边界条件。\\n\\n⚠️ 需要注意的 3 个坑：\\n\\n① 积分刷单风险：需要设置单日上限和异常行为检测\\n② 优惠券核销与库存：防止超发导致亏损\\n③ 积分通胀：半年后用户手里积分太多会降低品牌溢价\\n\\n建议在 PRD 中加入「积分健康度监控」机制 📊\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(355,NULL,'Amy · 运营总监','amy-operations-director',39.00,'全能 AI 运营助手。覆盖用户增长、活动策划、社群运营与留存优化全链路。自动生成运营日历、监控关键指标、输出数据复盘报告，并基于用户行为数据持续调整运营策略，让业务飞轮高速转动。',NULL,'available','AI 角色','[{\"text\": \"你好！我是你的运营总监 🚀\\n覆盖用户增长、活动策划与留存优化全链路。你们现在最大的运营挑战是什么？\", \"type\": \"ai\"}, {\"text\": \"新用户注册了，但 7 天后基本都流失了\", \"type\": \"user\"}, {\"text\": \"新用户 7 日流失是最常见的增长瓶颈。通常原因是：\\n\\n① 没有引导完成关键行为（Aha Moment）\\n② 新手引导体验差\\n③ 缺乏 D1/D3/D7 激活触达\\n\\n你们产品的「关键行为」是什么？比如发帖、购买、添加好友？\", \"type\": \"ai\"}, {\"text\": \"电商平台，关键行为是完成首单\", \"type\": \"user\"}, {\"text\": \"好，7 日激活方案：\\n\\n📅 注册当天：首单立减券 + 新手任务引导\\n📅 D2：浏览未下单 → 推送「你看过的商品还有 X 件库存」\\n📅 D3：推送「限时专属价」+ 好评晒单激励\\n📅 D7：如未下单 → 最后一次高力度挽回弹窗\\n\\n预计首单转化率提升 25-40%。需要我生成完整的 30 天运营日历吗？\", \"type\": \"ai\"}]',NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(356,NULL,'小红书运营助手','xiaohongshu-operations-kit',9.90,'专为小红书内容创作者和品牌设计的技能包。包含爆款标题生成、笔记结构模板、话题标签策略、评论互动话术及数据复盘模板。一键输出符合平台算法偏好的图文内容，快速积累自然流量。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(357,NULL,'公众号运营助手','wechat-official-account-kit',0.00,'微信公众号全流程运营技能包。涵盖选题策划、排版规范、推文撰写、菜单配置建议与粉丝互动话术。内置多种文章风格模板（深度长文、轻量资讯、互动投票），帮助账号持续保持高打开率与低取关率。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(358,NULL,'抖音爆款视频脚本','douyin-viral-script-kit',9.90,'专为抖音创作者打造的脚本生成技能。内置钩子开场、情绪节奏、转折设计与引导关注话术模板。支持口播、剧情、测评、种草等多种视频类型，平均完播率提升 40%。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(359,NULL,'AI 冷邮件外联','ai-cold-email-outreach-kit',0.00,'B2B 销售团队必备技能包。自动研究目标客户背景、生成个性化开场白、撰写跟进序列邮件并优化主题行。平均回复率提升 3 倍，帮助销售团队高效拓客。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(360,NULL,'Prompt 工程师工具包','prompt-engineering-toolkit',9.90,'系统化提示词设计与优化技能。覆盖 Chain-of-Thought、Few-shot、ReAct、角色扮演等主流提示技巧，内含 200+ 可复用提示模板，帮助开发者快速构建高质量 AI 工作流。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(361,NULL,'Next.js 全栈开发加速','nextjs-fullstack-accelerator',0.00,'涵盖 Next.js App Router、API 设计、数据库集成与部署配置的完整开发技能。内置代码审查、性能优化建议与最佳实践检查清单，帮助独立开发者快速交付生产级应用。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(362,NULL,'LinkedIn 个人品牌增长','linkedin-personal-brand-kit',9.90,'专为职场人和创始人设计的 LinkedIn 运营技能。包含个人简介优化、内容日历规划、爆款帖子生成器、评论互动策略与连接请求话术，帮助账号在 30 天内实现粉丝量翻倍。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(363,NULL,'电商选品与竞品分析','ecommerce-product-research-kit',0.00,'跨境电商卖家的智能选品工具包。自动抓取 Amazon、速卖通热销数据，分析利润空间、竞争密度与趋势走向，输出可操作的选品报告，大幅降低新品试错成本。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(364,NULL,'Figma 设计系统生成器','figma-design-system-generator',9.90,'一键生成完整设计系统的 AI 技能。根据品牌色和字体偏好，自动产出组件库规范、间距系统、图标风格指南与深色模式适配方案，让设计与研发协作效率提升 50%。',NULL,'available','设计',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(365,NULL,'投资人 Pitch Deck','investor-pitch-deck-kit',0.00,'帮助创业者打磨融资演示文稿的技能包。涵盖问题定义、市场规模、商业模式、竞争壁垒与财务预测各模块的撰写框架，并内置顶级 VC 常见问题应答库，大幅提升路演通过率。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(366,NULL,'AI 客服知识库构建','ai-knowledge-base-builder',9.90,'快速搭建企业专属 AI 知识库的工具包。自动整理 FAQ、产品文档与历史工单，生成结构化知识图谱，支持接入 ChatBot 或内部搜索系统，让客服响应准确率达到 90% 以上。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(367,NULL,'本体知识图谱','ontology',0.00,'用于结构化智能体记忆与可组合技能的类型化知识图谱。支持创建和查询实体（人物、项目、任务、事件、文档），关联对象，执行约束校验，将多步骤操作规划为图变换，以及跨技能共享状态。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(368,NULL,'自我进化智能体','self-improving-agent',9.90,'捕获学习经验、错误与修正以实现持续改进。适用于命令意外失败、用户纠正 AI 输出、需要记录操作规律等场景，让智能体越用越聪明。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(369,NULL,'Google 全家桶命令行','google-workspace-cli',0.00,'一站式操控 Gmail、Google Calendar、Drive、Contacts、Sheets 和 Docs 的命令行技能包。让 AI 直接读写你的 Google 工作区，自动化日常办公流程。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(370,NULL,'Tavily 网页搜索','tavily-web-search',9.90,'通过 Tavily API 实现 AI 优化的网页搜索。为 AI 智能体返回简洁、相关的搜索结果，无需浏览器，响应速度极快。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(371,NULL,'技能发现助手','find-skills',0.00,'当用户询问如何做某件事或寻找特定功能时，自动帮助发现并安装合适的智能体技能。是扩展 AI 能力边界的最佳入口。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(372,NULL,'内容摘要生成器','summarize',9.90,'一键摘要 URL 或文件内容，支持网页、PDF、图片、音频和 YouTube 视频。使用 summarize CLI 驱动，无需额外 API Key。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(373,NULL,'AI 浏览器自动化','agent-browser',0.00,'基于 Rust 的高速无头浏览器自动化 CLI，支持 Node.js 降级。让 AI 智能体实现页面导航、点击、输入和截图，通过结构化命令完全控制浏览器行为。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(374,NULL,'GitHub 操作包','github-cli-kit',9.90,'使用 gh CLI 与 GitHub 深度集成。支持 Issue 管理、PR 审查、CI 运行监控与 API 高级查询，让 AI 直接参与代码协作流程。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(375,NULL,'实时天气查询','weather-forecast',0.00,'获取当前天气状况与未来预报，无需 API Key。支持全球城市查询，可集成到日程规划、出行助手等工作流中。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(376,NULL,'Polymarket 预测市场','polymarket-odds',9.90,'查询 Polymarket 预测市场数据，检查赔率、热门市场、事件搜索、价格走势与动量分析。包含观察列表提醒、结算日历与市场对比功能。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(377,NULL,'主动型智能体框架','proactive-agent',0.00,'将 AI 从任务执行者升级为主动合作伙伴，能预判需求、持续自我改进。包含 WAL 协议、工作缓冲区、自主定时任务与实战验证模式。Hal Stack 系列。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(378,NULL,'Notion 工作区管理','notion-workspace',9.90,'通过 Notion API 创建和管理页面、数据库与内容块。让 AI 直接读写你的 Notion 工作区，自动化知识管理与项目追踪流程。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(379,NULL,'PDF 自然语言编辑器','nano-pdf-editor',0.00,'用自然语言指令编辑 PDF 文件。基于 nano-pdf CLI，支持文本修改、页面操作与内容提取，无需专业 PDF 工具。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(380,NULL,'AI 图像生成与编辑','ai-image-generator',9.90,'基于 Gemini 3 Pro 的图像生成与编辑技能。支持文字生成图像和图像二次编辑，提供 1K/2K/4K 分辨率输出，可用于设计素材、营销图片与创意内容生产。',NULL,'available','设计',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(381,NULL,'API 网关集成','api-gateway-kit',0.00,'一键接入 100+ 主流 API，包括 Google Workspace、Microsoft 365、GitHub、Notion、Slack、Airtable、HubSpot 等，托管 OAuth 认证，无需手动配置密钥。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(382,NULL,'Obsidian 笔记自动化','obsidian-automation',9.90,'操作 Obsidian 知识库（Markdown 笔记）并通过 obsidian-cli 实现自动化。支持笔记创建、搜索、链接管理与双链知识图谱维护。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(383,NULL,'Whisper 本地语音转文字','openai-whisper-local',0.00,'使用 OpenAI Whisper CLI 实现本地语音转文字，无需 API Key，数据完全本地处理。支持多语言识别，适合会议记录、播客转写与语音备忘录场景。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(384,NULL,'AI 写作人性化改写','humanizer-ai-text',9.90,'去除 AI 写作痕迹，让文本更自然真实。自动检测并修正夸张象征、宣传语气、表面分析、模糊归因、破折号滥用、三段式结构与 AI 专属词汇等问题。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(385,NULL,'免费 AI 模型管理器','free-ai-model-manager',0.00,'通过 OpenRouter 管理免费 AI 模型，自动按质量排名、配置降级回退策略并更新 OpenClaw 配置。让你始终使用最优质的免费模型，零成本运行 AI 工作流。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(386,NULL,'MCP 服务器管理工具','mcp-server-manager',9.90,'使用 mcporter CLI 列出、配置、认证并调用 MCP 服务器与工具，支持 HTTP 和 stdio 模式，包括临时服务器、配置编辑与 CLI 类型生成。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(387,NULL,'Brave 网页搜索','brave-search-kit',0.00,'通过 Brave Search API 实现网页搜索与内容提取。适用于文档查询、事实核验或任意网页内容获取，轻量级设计，无需浏览器。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(388,NULL,'项目知识上下文管理','project-knowledge-context',9.90,'使用 ByteRover 上下文树管理项目知识，提供查询和整理两种操作。适用于信息检索、规律发现与跨会话知识持久化场景。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(389,NULL,'智能体自动更新器','auto-updater-skill',0.00,'每日自动更新 OpenClaw 及所有已安装技能。通过 cron 定时运行，检查更新、自动应用，并向用户发送变更摘要，保持 AI 工作流始终处于最新状态。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(390,NULL,'Slack 消息自动化','slack-automation-kit',9.90,'通过 Slack API 实现消息发送、频道管理、工作流触发与通知自动化。支持定时推送、关键词监听与多频道批量操作，让团队沟通效率翻倍。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(391,NULL,'SQL 数据库查询助手','sql-query-assistant',0.00,'自然语言转 SQL 查询技能。支持 MySQL、PostgreSQL、SQLite 等主流数据库，自动生成复杂查询、优化执行计划并解释查询结果，让非技术人员也能轻松操作数据库。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(392,NULL,'Docker 容器管理','docker-management-kit',9.90,'AI 驱动的 Docker 容器管理工具包。支持容器启停、镜像构建、日志分析、网络配置与 Docker Compose 编排，让运维操作变得简单直观。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(393,NULL,'代码审查与重构','code-review-refactor-kit',0.00,'专业级代码审查与重构技能包。自动检测代码异味、安全漏洞、性能瓶颈与可读性问题，提供具体修复建议与重构方案，支持 Python、JavaScript、TypeScript、Go 等主流语言。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(394,NULL,'多语言翻译','multilingual-translation-kit',9.90,'支持 100+ 语言的专业翻译技能包。具备语境感知、行业术语库与品牌语调一致性保障，适用于产品文档、营销内容、法律合同与用户界面本地化翻译。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(395,NULL,'会议记录与行动项提取','meeting-notes-action-items',0.00,'自动整理会议记录，提取关键决策与行动项，分配责任人并设定截止日期。支持语音转文字输入，输出结构化会议纪要并同步至 Notion、飞书、Slack 等协作工具。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(396,NULL,'Airtable 数据库自动化','airtable-automation-kit',9.90,'通过自然语言操作 Airtable 数据库。支持记录增删改查、视图筛选、自动化规则配置与跨表关联，让业务数据管理变得像对话一样简单。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(397,NULL,'邮件营销序列生成器','email-marketing-sequence',0.00,'自动生成高转化率的邮件营销序列。涵盖欢迎系列、培育序列、复购激活与流失挽回邮件，内置 A/B 测试建议与主题行优化，适配 Mailchimp、SendGrid 等主流平台。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(398,NULL,'竞品监控与分析','competitor-monitoring-kit',9.90,'持续追踪竞争对手的产品更新、定价变化、营销动态与用户反馈。自动生成竞品对比报告，识别市场空白与差异化机会，帮助产品和营销团队保持竞争优势。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(399,NULL,'Jira 项目管理助手','jira-project-management',0.00,'通过自然语言操作 Jira，实现 Issue 创建、Sprint 规划、工时记录与看板管理。自动生成迭代报告、燃尽图分析与团队工作负载均衡建议。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(400,NULL,'品牌视觉识别系统','brand-visual-identity-kit',9.90,'一站式品牌视觉设计技能。根据品牌定位自动生成 Logo 概念方案、色彩系统、字体搭配、图标风格与品牌使用规范手册，帮助初创企业快速建立专业品牌形象。',NULL,'available','设计',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(401,NULL,'Stripe 支付集成','stripe-payment-integration',0.00,'快速集成 Stripe 支付系统的开发技能包。涵盖一次性支付、订阅管理、退款处理、Webhook 配置与财务对账自动化，支持多币种与多种支付方式。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(402,NULL,'用户调研与访谈分析','user-research-interview-kit',9.90,'AI 驱动的用户调研全流程技能。自动设计访谈问卷、分析访谈录音、提炼用户痛点与需求洞察，生成结构化用户画像与产品改进建议报告。',NULL,'available','设计',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(403,NULL,'自动化测试生成','automated-test-generation',0.00,'自动为代码库生成单元测试、集成测试与端到端测试。支持 Jest、Pytest、Cypress 等主流测试框架，自动计算覆盖率并识别未测试的关键路径。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(404,NULL,'飞书文档自动化','feishu-lark-automation',9.90,'深度集成飞书（Lark）工作区，实现文档创建、多维表格操作、日历管理、消息推送与审批流程自动化。专为国内企业协作场景优化，大幅提升团队工作效率。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(405,NULL,'舆情监控与品牌声誉管理','brand-reputation-monitoring',0.00,'实时监控品牌在微博、微信、知乎、抖音等平台的舆情动态，自动识别负面内容并生成应对建议，帮助企业将危机扼杀在萌芽阶段，维护品牌声誉。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(406,NULL,'AWS 云资源管理','aws-cloud-management',9.90,'用自然语言管理 AWS 云资源。支持 EC2、S3、Lambda、RDS 等核心服务的查询、配置与成本优化建议，帮助开发团队降低云支出并提升资源利用率。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(407,NULL,'知乎高赞回答生成器','zhihu-answer-generator',0.00,'专为知乎平台优化的内容创作技能。分析热门话题结构与高赞回答规律，自动生成有深度、有观点、有数据支撑的专业回答，帮助个人和品牌在知乎建立行业权威形象。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(408,NULL,'B 站视频脚本与封面','bilibili-content-kit',9.90,'专为 B 站 UP 主打造的内容创作工具包。包含选题策划、视频脚本、分镜建议、封面文案设计与标签优化，帮助视频快速进入推荐流，提升播放量与粉丝增长。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(409,NULL,'HubSpot CRM 自动化','hubspot-crm-automation',0.00,'深度集成 HubSpot CRM，实现联系人管理、销售漏斗追踪、自动跟进任务创建与营销邮件触发。结合 AI 分析客户行为，帮助销售团队精准把握成交时机。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(410,NULL,'Vercel 部署自动化','vercel-deployment-automation',9.90,'一键管理 Vercel 项目部署、环境变量配置、域名绑定与性能监控。支持预览部署链接生成、回滚操作与 Edge Function 配置，让前端部署流程完全自动化。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(411,NULL,'播客内容生产','podcast-production-kit',0.00,'播客创作者的全流程 AI 助手。涵盖选题策划、嘉宾问题设计、开场白与结束语生成、录音转写、内容摘要与多平台推广文案，让每期播客的制作时间缩短 60%。',NULL,'available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(412,NULL,'Claude 系统提示词优化','claude-system-prompt-optimizer',9.90,'专为 Claude 模型优化的系统提示词工程技能。内含角色设定、输出格式控制、思维链激活、安全边界设置与多轮对话记忆管理等高级技巧，大幅提升 AI 输出质量。',NULL,'available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(413,NULL,'独立开发者启动包','indie-hacker-starter-kit',0.00,'专为独立开发者和一人公司设计的全栈 AI 工具包。涵盖产品定位、落地页文案、定价策略、冷启动增长方法与早期用户获取，帮助你在 30 天内完成从想法到首批付费用户的完整旅程。',NULL,'available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(414,NULL,'OpenClaw 企业级营销助手','openclaw-enterprise-marketing',9.90,'专门为中小型企业设计的 AI 营销角色。能够自动生成社交媒体内容、分析市场趋势并优化广告投放。包含全套自动化工作流。','https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop','available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(415,NULL,'Python 自动化工程专家','python-automation-expert',0.00,'一个高度优化的 AI 角色，精通 Python 自动化脚本编写、API 集成和数据处理。内置 50+ 常用自动化模板。','https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop','available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(416,NULL,'极简主义 UI/UX 设计师','minimalist-uiux-designer',9.90,'专注于现代 SaaS 产品界面的 AI 设计智能体。能够基于简单的描述生成 Figma 布局建议、配色方案和交互原型。','https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop','available','设计',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(417,NULL,'电商运营增长黑客','ecommerce-growth-hacker',0.00,'为独立站和电商平台设计的 AI 助手。监控竞争对手价格、优化产品标题并自动处理客户常见咨询。大幅提升转化率。','https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop','available','营销',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(418,NULL,'Rust 系统性能优化专家','rust-performance-expert',9.90,'高级 AI 角色，专注于低延迟系统设计和 Rust 代码优化。能够重构瓶颈代码并提供内存安全建议。','https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop','available','工程',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(419,NULL,'创意文案排版智能体','creative-copy-typesetter',0.00,'一个轻量级的技能插件，用于优化长篇博文和营销邮件的视觉层次和可读性。支持多种排版风格。','https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop','available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(420,NULL,'财务审计与报表分析员','finance-audit-analyst',9.90,'合规性极强的 AI 智能体。能够处理复杂的财务数据导出、自动进行账目比对并生成季度合规性分析报告。','https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop','available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(421,NULL,'法律条款分析助手 (中国版)','legal-clause-analyzer-cn',0.00,'深入理解中国商法和劳动法的 AI 角色。帮助初创企业快速审核合同风险并提供法律条款合规建议。','https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop','available','其他',NULL,NULL,'2026-04-05 21:52:53','2026-04-05 21:52:53'),(422,NULL,'生鲜门店 AI 店长助手','fresh-market-ai-manager',299.00,'专为生鲜连锁门店打造的全链路 AI 经营系统。核心理念：「人工碎片化输入 + AI 结构化处理 + AI 智能决策」，彻底解决生鲜行业规格混乱、信息录入难、损耗高的三大痛点。\n\n涵盖九大功能模块：\n① AI 店长助手（语音/拍照上报，企业微信集成）\n② 商品库与实时库存系统\n③ AI 智能下单预测（天气/节假日多因子模型）\n④ AI 促销清货引擎（自动触发，临期预警）\n⑤ 竞品情报系统（爬虫+员工上报）\n⑥ 财务支出智能管理（OCR 票据识别）\n⑦ 人事人才库（自然语言简历搜索）\n⑧ 多维数据看板（门店/总部/单品三级）\n⑨ 权限管理中心（总部/店长/店员/财务四级）\n\n适用场景：香港/内地生鲜连锁门店、生鲜超市、农贸市场档主升级。安装后可接入企业微信，店员无需培训即可上报实况。','https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"老板端\", \"messages\": [{\"text\": \"上周整体毛利怎么样？\", \"type\": \"user\"}, {\"text\": \"📊 上周经营简报（4月1日－4月6日）\\n\\n总营业额：¥38,420　毛利率：23.6%（↑1.2%）\\n损耗金额：¥1,240（损耗率 3.2%，行业均值 5.8%）\\n\\n💡 亮点：胡萝卜、西红柿连续爆款，合计贡献毛利 34%\\n⚠️ 风险：草莓本周进货量偏高，建议提前促销\", \"type\": \"ai\"}, {\"text\": \"草莓怎么处理\", \"type\": \"user\"}, {\"text\": \"✅ 已为草莓生成清货方案：\\n\\n今日下午触发「买二送一」活动\\n预计消化库存 80%，损耗降至 ¥120 以内\\n\\n是否授权店长执行？\", \"type\": \"ai\"}, {\"text\": \"授权\", \"type\": \"user\"}, {\"text\": \"✅ 已通知各门店店长执行草莓促销\\n📲 同步推送企业微信通知\\n\\n今日 17:00 将生成促销效果预报，请查收。\", \"type\": \"ai\"}]}, {\"label\": \"店长端\", \"messages\": [{\"text\": \"胡萝卜今天下午3点就卖完了\", \"type\": \"user\"}, {\"text\": \"✅ 已记录：胡萝卜 今日15:00 售罄\\n\\n📊 AI 分析：\\n胡萝卜本周已连续3天提前售罄，今日较昨日提前2小时。\\n\\n💡 建议：\\n明日进货量建议从 50斤 → 70斤（+40%）\\n是否立即发送进货调整建议给采购？\", \"type\": \"ai\"}, {\"text\": \"发给采购，西红柿也一起看看\", \"type\": \"user\"}, {\"text\": \"✅ 已通知采购小王\\n📋 明日胡萝卜调整进货单已发送\\n\\n西红柿昨日剩余15斤，今日是第2天，建议触发8折清货。\\n是否确认执行？\", \"type\": \"ai\"}, {\"text\": \"确认\", \"type\": \"user\"}, {\"text\": \"✅ 西红柿8折清货已启动\\n📲 已通知收银台更新价签\\n\\n预计今日可清货 12斤，避免明日过期损耗约 ¥48。\", \"type\": \"ai\"}]}, {\"label\": \"店员端\", \"messages\": [{\"text\": \"蓝莓刚到货，大概100盒\", \"type\": \"user\"}, {\"text\": \"✅ 已录入：蓝莓 到货100盒\\n\\n📦 请确认以下信息：\\n产地：不详　保质期：请拍照标签\\n建议售价：¥18.8/盒（参考本周市场价）\\n\\n请拍一张外箱标签，我来自动录入批次信息 📷\", \"type\": \"ai\"}, {\"text\": \"[图片] 这是标签\", \"type\": \"user\"}, {\"text\": \"✅ 已识别标签：\\n产地：云南　生产日期：4月5日　保质期5天\\n\\n📊 系统已自动设置：\\n临期预警：4月8日（到期前2天提醒促销）\\n摆放建议：冷藏区 B3 货架（温度 2–4°C）\\n\\n入库完成，库存已更新 ✅\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53'),(423,NULL,'餐饮连锁 AI 运营助手','restaurant-chain-ai-ops',399.00,'专为餐饮连锁门店打造的全链路 AI 运营系统。核心理念：「门店数据实时上报 + AI 智能分析 + 总部统一决策」，解决餐饮行业多门店协同难、备货浪费高、员工排班乱三大痛点。\n\n涵盖六大功能模块：\n① 实时营业额监控（分钟级数据推送）\n② AI 备货预测（节假日/天气多因子模型）\n③ 智能排班系统（依客流自动生成班表）\n④ 食材损耗预警（临期自动触发处理建议）\n⑤ 顾客评价智能汇总（差评实时告警）\n⑥ 多门店数据看板（总部/区域/单店三级）\n\n适用场景：连锁快餐、奶茶、火锅等餐饮品牌，2 店以上即可部署，接入企业微信开箱即用。','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"老板端\", \"messages\": [{\"text\": \"昨天三亚店营业额怎么样\", \"type\": \"user\"}, {\"text\": \"📊 三亚店 昨日经营简报\\n\\n营业额：¥18,640　目标完成率：94%\\n客单价：¥47.2（↑3.1%）　翻台率：3.8次\\n\\n⚠️ 异常：午市 12:00–13:30 出餐等待超 22 分钟，差评 3 条\\n\\n💡 建议：午市增加 1 名备餐人员，或启用「预点餐」功能减少高峰压力\", \"type\": \"ai\"}, {\"text\": \"上周各门店对比\", \"type\": \"user\"}, {\"text\": \"📊 上周门店排名（营业额）\\n\\n🥇 海口店　¥138,200（↑8%）\\n🥈 三亚店　¥121,400（↑2%）\\n🥉 文昌店　¥89,600（↓5%）⚠️\\n\\n文昌店下滑原因：周四周五连续下雨，外卖单量减少 40%\\n建议本周加大外卖平台曝光投入\", \"type\": \"ai\"}]}, {\"label\": \"店长端\", \"messages\": [{\"text\": \"今天猪肉快用完了\", \"type\": \"user\"}, {\"text\": \"✅ 已记录：猪肉库存预警\\n\\n📊 当前库存：约 8 斤，按昨日用量预计今日 15:00 耗尽\\n\\n💡 建议立即补货：\\n联系供应商张师傅（136xxxx）补 30 斤\\n或从海口仓库调拨，预计 2 小时到达\\n\\n是否现在发送补货申请？\", \"type\": \"ai\"}, {\"text\": \"发给张师傅\", \"type\": \"user\"}, {\"text\": \"✅ 已发送补货请求给张师傅\\n📲 企业微信消息已推送\\n\\n另：今日预订 6 桌，最早 17:30 到店，请提前备餐。\", \"type\": \"ai\"}]}, {\"label\": \"店员端\", \"messages\": [{\"text\": \"4号桌客人投诉等太久了\", \"type\": \"user\"}, {\"text\": \"✅ 已记录：4号桌客诉（等待时间过长）\\n\\n📋 处理建议：\\n① 立即告知店长\\n② 赠送一杯饮品表示歉意\\n③ 下次来店优惠券（系统自动发送至客户手机）\\n\\n店长已收到通知 📲\", \"type\": \"ai\"}, {\"text\": \"好的已处理\", \"type\": \"user\"}, {\"text\": \"✅ 已更新处理状态\\n\\n本次客诉已归档，将计入本月服务质量报告。\\n\\n💡 小提示：今日午市高峰还有 30 分钟，5 号、7 号桌即将结束用餐，提前准备清台。\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53'),(424,NULL,'零售门店 AI 导购助手','retail-store-ai-guide',199.00,'专为服装、母婴、家居等实体零售门店设计的 AI 导购与运营系统。将传统导购经验数字化，实现「顾客需求快速识别 + 精准推荐 + 销售数据沉淀」的智能导购闭环。\n\n涵盖五大功能模块：\n① AI 导购话术库（依品类自动匹配推荐逻辑）\n② 顾客偏好记录（会员画像自动更新）\n③ 库存实时查询（断货提醒+调货建议）\n④ 促销活动管理（优惠券自动发放）\n⑤ 每日销售简报（店长早报/晚报）\n\n适用场景：服装、母婴、美妆、家居等实体零售门店，单店/连锁均可部署。','https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"老板端\", \"messages\": [{\"text\": \"本月哪款卖得最好\", \"type\": \"user\"}, {\"text\": \"📊 本月销售 TOP 3（截至今日）\\n\\n🥇 亚麻宽松西裤（米白）　售出 87 件　¥23,490\\n🥈 真丝衬衫（淡蓝）　　　售出 64 件　¥19,200\\n🥉 棉麻连衣裙（深绿）　　售出 51 件　¥12,750\\n\\n💡 亚麻西裤库存仅剩 12 件，建议本周补货 50 件\", \"type\": \"ai\"}]}, {\"label\": \"店员端\", \"messages\": [{\"text\": \"顾客要找M码的亚麻裤，还有货吗\", \"type\": \"user\"}, {\"text\": \"✅ 查询结果：亚麻宽松西裤 M码\\n\\n本店库存：3 件（陈列区 B2）\\n\\n💡 如需试穿，告知顾客试衣间现在空闲\\n该款本月销售 87 件，好评率 96%，可推荐配同款亚麻衬衫\", \"type\": \"ai\"}, {\"text\": \"顾客买了，开单\", \"type\": \"user\"}, {\"text\": \"✅ 已记录销售：亚麻西裤 M码 × 1\\n库存更新：M码剩余 2 件\\n\\n📲 已向顾客发送电子小票\\n🎁 顾客本月累计消费 ¥680，距下一级会员还差 ¥320，可告知顾客\", \"type\": \"ai\"}]}, {\"label\": \"店长端\", \"messages\": [{\"text\": \"今天业绩怎么样\", \"type\": \"user\"}, {\"text\": \"📊 今日营业简报（截至 17:30）\\n\\n营业额：¥8,240　目标进度：82%（目标 ¥10,000）\\n客单价：¥412　进店客流：32 人　成交率：62%\\n\\n💡 距收店还有 2.5 小时，建议：\\n① 推送今日限时折扣给附近会员\\n② 主推亚麻西裤（库存告急，冲刺成交）\\n\\n是否现在发送会员优惠推送？\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53'),(425,NULL,'医疗诊所 AI 助理系统','clinic-ai-assistant',499.00,'专为中小型医疗诊所打造的全流程 AI 管理系统。核心理念：「患者全程无缝衔接 + 医生减负提效 + 合规风险可控」，解决诊所预约混乱、病历录入慢、复诊流失高三大痛点。\n\n涵盖七大功能模块：\n① AI 预约调度（微信/电话/现场三端统一）\n② 智能分诊导诊（症状初筛+科室推荐）\n③ 病历语音录入（方言识别+结构化输出）\n④ AI 随访管理（复诊提醒+康复跟进）\n⑤ 药品库存预警（临期提醒+自动补货建议）\n⑥ 医保合规助手（收费审查+报销材料生成）\n⑦ 经营数据看板（就诊量/收入/患者留存）\n\n适用场景：口腔诊所、中医馆、专科门诊、社区卫生中心，日均接诊 20 人以上即可部署。','https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"院长端\", \"messages\": [{\"text\": \"上个月收入怎么样，复诊率多少\", \"type\": \"user\"}, {\"text\": \"📊 上月经营简报\\n\\n总收入：¥186,400（↑12%）\\n就诊人次：843次　日均：27次\\n复诊率：38%（行业均值 25%）✅\\n\\n⚠️ 问题：新患流失率 61%，主要集中在首诊后 7 天内未收到随访\\n\\n💡 建议：开启「7日自动随访」功能，预计可将复诊率提升至 48%\", \"type\": \"ai\"}, {\"text\": \"开启随访，上个月哪个科室收入最高\", \"type\": \"user\"}, {\"text\": \"✅ 已开启 7 日自动随访\\n📲 首批 47 位患者将于今日收到随访消息\\n\\n📊 上月科室收入排名：\\n🥇 口腔科　¥89,200（47.8%）\\n🥈 中医理疗　¥54,600（29.3%）\\n🥉 儿科　¥42,600（22.9%）\\n\\n口腔科正畸项目贡献最大，建议增加正畸医生排班\", \"type\": \"ai\"}]}, {\"label\": \"医生端\", \"messages\": [{\"text\": \"下午三点的张伟来了，帮我拉一下他的病历\", \"type\": \"user\"}, {\"text\": \"📋 患者：张伟　男　42岁\\n\\n上次就诊：3月15日（32天前）\\n主诉：慢性腰痛\\n处方：布洛芬缓释片 × 14天 + 理疗 3次\\n\\n⚠️ 注意：张伟对青霉素过敏，已标记\\n💊 上次开的药今日恰好用完，建议评估是否续药\", \"type\": \"ai\"}, {\"text\": \"续药，加开膏药，帮我生成病历\", \"type\": \"user\"}, {\"text\": \"✅ 病历已生成：\\n\\n复诊记录 | 2026-04-06\\n主诉：腰痛持续，较上次略有缓解\\n处理：续开布洛芬缓释片 × 14天；新增腰痛膏 × 5贴\\n注意：患者青霉素过敏，本次用药无冲突 ✅\\n\\n📄 电子病历已存档，是否打印处方？\", \"type\": \"ai\"}]}, {\"label\": \"前台端\", \"messages\": [{\"text\": \"有个患者说要取消明天上午的预约\", \"type\": \"user\"}, {\"text\": \"请问患者姓名或手机号？\", \"type\": \"ai\"}, {\"text\": \"李梅，138开头\", \"type\": \"user\"}, {\"text\": \"✅ 已找到：李梅　138xxxx5678\\n明日 10:30　口腔科　王医生\\n\\n已取消预约，是否帮她改约其他时间？\\n\\n王医生明日还有空档：\\n• 14:00\\n• 15:30\", \"type\": \"ai\"}, {\"text\": \"她说不用了，取消就好\", \"type\": \"user\"}, {\"text\": \"✅ 已取消并发送确认短信给李梅\\n\\n📲 王医生 10:30 空档已自动开放，候补患者刘强已收到通知\\n\\n今日剩余预约：14 人，候诊区现在有 3 人等待\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53'),(426,NULL,'教育机构 AI 管理中台','education-center-ai-platform',299.00,'专为中小型教培机构设计的全链路 AI 运营系统。核心理念：「招生转化提效 + 教学质量可视 + 续费留存智能」，解决教培行业获客成本高、学员流失难追踪、老师排课混乱三大痛点。\n\n涵盖六大功能模块：\n① AI 招生助手（线索自动跟进+试听转化提醒）\n② 智能排课系统（教室/老师/学员三维匹配）\n③ 学员成长档案（课堂表现+作业+测评全记录）\n④ AI 续费预警（流失风险识别+自动触达）\n⑤ 家长沟通助手（周报自动生成+家长群播报）\n⑥ 经营数据看板（招生/续费/出勤/收入多维）\n\n适用场景：K12 补习、艺术培训、语言学校、职业技能培训机构，50 人以上学员规模即可部署。','https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"校长端\", \"messages\": [{\"text\": \"本月招生情况怎么样\", \"type\": \"user\"}, {\"text\": \"📊 本月招生简报（截至今日）\\n\\n新增线索：126 个　试听：48 人　正式报名：31 人\\n转化率：64.6%（↑8% vs 上月）\\n\\n⚠️ 风险：37 个线索超过 3 天未跟进，流失风险高\\n\\n💡 建议：开启「线索自动提醒」，超 24 小时未联系自动推送给招生老师\", \"type\": \"ai\"}, {\"text\": \"开启，续费这个月怎么样\", \"type\": \"user\"}, {\"text\": \"✅ 线索自动提醒已开启\\n\\n📊 续费情况：\\n本月到期：89 人　已续费：61 人　续费率：68.5%\\n\\n⚠️ 28 人未续费，其中 12 人已识别为高流失风险\\n主要原因：连续 2 次旷课（7人）、家长投诉未处理（3人）\\n\\n是否现在生成这 12 人的挽留方案？\", \"type\": \"ai\"}]}, {\"label\": \"老师端\", \"messages\": [{\"text\": \"帮我写一下今天小明的课堂反馈\", \"type\": \"user\"}, {\"text\": \"请简单描述一下小明今天的表现，我来生成完整反馈报告：\", \"type\": \"ai\"}, {\"text\": \"上课注意力不集中，数学口算比上周进步了，但应用题还是不太会\", \"type\": \"user\"}, {\"text\": \"✅ 课堂反馈已生成：\\n\\n【李小明 · 今日课堂记录】\\n\\n专注度：需关注⚠️ 今日课堂注意力较分散，建议家长检查睡眠情况\\n\\n进步亮点：口算速度较上周提升明显，连续答对 8 题 🎉\\n\\n待提升：应用题理解能力需加强，建议本周加练「读题找关键词」专项\\n\\n📲 是否现在发送给家长？\", \"type\": \"ai\"}, {\"text\": \"发送\", \"type\": \"user\"}, {\"text\": \"✅ 已发送给小明家长\\n📱 家长已读（14:32）\\n\\n另：小明本月已累计旷课 1 次，下次旷课将触发续费风险预警，请留意。\", \"type\": \"ai\"}]}, {\"label\": \"前台端\", \"messages\": [{\"text\": \"有家长问下周课程安排\", \"type\": \"user\"}, {\"text\": \"请问是哪位学员的家长？\", \"type\": \"ai\"}, {\"text\": \"王芳的妈妈\", \"type\": \"user\"}, {\"text\": \"📅 王芳 下周课程安排：\\n\\n周一 16:00　数学　张老师　3号教室\\n周三 16:00　数学　张老师　3号教室\\n周六 10:00　英语　李老师　5号教室\\n\\n📲 是否发送课程表给家长微信？\", \"type\": \"ai\"}, {\"text\": \"发\", \"type\": \"user\"}, {\"text\": \"✅ 已发送课程表给王芳妈妈\\n\\n另：王芳本期课程将于 4月20日到期，距续费还有 14 天，是否现在发送续费提醒？\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53'),(427,NULL,'物流仓储 AI 调度系统','logistics-warehouse-ai',599.00,'专为中小型物流仓储企业打造的全链路 AI 调度系统。核心理念：「入库出库零差错 + 运力智能匹配 + 异常实时预警」，解决物流行业库存盘点慢、调度效率低、货损追责难三大痛点。\n\n涵盖七大功能模块：\n① 智能收货验货（OCR 识别+自动入库）\n② 库位智能分配（货物特性+频率双维度）\n③ AI 拣货路径优化（减少行走距离 40%）\n④ 运力智能调度（车辆+司机+路线三维匹配）\n⑤ 货损异常追踪（拍照上报+责任链自动记录）\n⑥ 客户自助查单（微信小程序实时追踪）\n⑦ 运营数据看板（吞吐量/准时率/损耗率）\n\n适用场景：区域配送中心、电商仓、冷链仓、第三方物流企业，日均出库 500 单以上即可部署。','https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"管理端\", \"messages\": [{\"text\": \"今天出库情况怎么样，准时率多少\", \"type\": \"user\"}, {\"text\": \"📊 今日出库简报（截至 16:00）\\n\\n已出库：1,248 单　待出库：87 单\\n准时率：94.2%（目标 95%）⚠️ 略低\\n\\n延误原因：\\n• 3号仓区拣货人手不足（23单延误）\\n• 京东快递今日提前收件，错过 11 单\\n\\n💡 建议：立即调配 2 名仓员支援 3 号区，预计可完成率恢复至 97%\", \"type\": \"ai\"}, {\"text\": \"调配，本周货损情况\", \"type\": \"user\"}, {\"text\": \"✅ 已通知仓管李师傅调配人手\\n\\n📊 本周货损报告：\\n货损金额：¥3,240（货损率 0.18%，行业均值 0.35%）✅\\n\\n主要货损：\\n• 易碎品包装不当 ¥1,800（3起，均为新员工操作）\\n• 冷链断链 ¥1,440（1起，夜班交接遗漏）\\n\\n💡 建议对新员工安排易碎品包装专项培训\", \"type\": \"ai\"}]}, {\"label\": \"调度端\", \"messages\": [{\"text\": \"下午有批货要发广州，安排一下\", \"type\": \"user\"}, {\"text\": \"请告知货物信息：件数、重量、是否有特殊要求？\", \"type\": \"ai\"}, {\"text\": \"80箱，约1.2吨，普货，下午3点前取走\", \"type\": \"user\"}, {\"text\": \"✅ 已匹配最优方案：\\n\\n推荐车辆：粤B-88421（4.2米厢车）\\n司机：王师傅　已联系，14:30 可到仓\\n预计费用：¥1,280（含过路费）\\n\\n备选：顺丰货运，今日 14:00 截单，费用 ¥1,560\\n\\n是否确认王师傅方案？\", \"type\": \"ai\"}, {\"text\": \"确认\", \"type\": \"user\"}, {\"text\": \"✅ 已确认，王师傅 14:30 到仓\\n📲 已发送取货信息给司机和收货方\\n\\n提货单已生成，请仓管准备装车 🚚\", \"type\": \"ai\"}]}, {\"label\": \"仓员端\", \"messages\": [{\"text\": \"刚收了一批货，箱子有破损\", \"type\": \"user\"}, {\"text\": \"请拍照上传破损情况，我来自动记录并生成异常报告 📷\", \"type\": \"ai\"}, {\"text\": \"[图片] 已上传\", \"type\": \"user\"}, {\"text\": \"✅ 已记录货损异常：\\n\\n时间：今日 10:42　库位：A区3排\\n描述：外箱破损，疑似运输途中挤压\\n\\n📋 异常报告已生成并发送给：\\n• 仓管主管（审核）\\n• 采购方（确认货物状态）\\n• 承运方（责任确认）\\n\\n货物暂存待检区，等待主管指示 ✅\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53'),(428,NULL,'酒店民宿 AI 管家系统','hotel-guesthouse-ai-butler',299.00,'专为精品酒店、民宿、短租公寓打造的全链路 AI 运营系统。核心理念：「入住体验极致化 + 运营成本最小化 + 口碑自动沉淀」，解决民宿行业多平台管理乱、差评响应慢、清洁排班难三大痛点。\n\n涵盖六大功能模块：\n① 多平台订单聚合（美团/携程/Airbnb 统一管理）\n② AI 客服自动回复（咨询/投诉/特殊需求 7×24）\n③ 智能清洁调度（退房/入住时间自动排班）\n④ 动态定价助手（节假日/竞品/天气联动定价）\n⑤ 差评预警与修复（负面评价 10 分钟响应）\n⑥ 经营数据看板（入住率/RevPAR/满意度）\n\n适用场景：精品民宿、连锁客栈、短租公寓、精品酒店，5 间房以上即可部署。','https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"老板端\", \"messages\": [{\"text\": \"五一假期订房情况怎么样\", \"type\": \"user\"}, {\"text\": \"📊 五一假期（5月1日-5日）预订情况\\n\\n已订房间：18/20 间（入住率 90%）✅\\n预计收入：¥42,600\\n\\n⚠️ 2间未订：301（景观大床）、502（亲子套房）\\n\\n💡 建议：五一前 3 天对这 2 间提价 15%，同步在抖音本地团购发限时特惠，通常能在节前清仓\", \"type\": \"ai\"}, {\"text\": \"提价，抖音发什么内容\", \"type\": \"user\"}, {\"text\": \"✅ 301和502已提价 15%\\n\\n📝 抖音推广文案已生成：\\n\\n「五一就剩最后 2 间！海景大床+亲子套房，五一不用抢票，住进来就是旅行🌊 限时特惠 ¥599起，扫码预订👇」\\n\\n配套建议：使用酒店露台+海景的真实视频，发布最佳时间：今晚 20:00\", \"type\": \"ai\"}]}, {\"label\": \"管家端\", \"messages\": [{\"text\": \"今天下午退房的有哪些，什么时候清洁\", \"type\": \"user\"}, {\"text\": \"📋 今日退房安排：\\n\\n14:00 退房：101、203、305（3间）\\n12:00 提前退：402\\n\\n✅ 清洁排班已生成：\\n小李负责101、203（预计 13:30 完成）\\n小张负责305、402（预计 14:00 完成）\\n\\n下午入住：\\n• 101　16:00 新客入住\\n• 305　15:00 入住（需提前备好儿童床）\\n\\n⚠️ 305 需提前准备儿童床，已提醒小张\", \"type\": \"ai\"}, {\"text\": \"好的，203有客人说空调有问题\", \"type\": \"user\"}, {\"text\": \"✅ 已记录：203空调故障\\n\\n📋 处理流程已启动：\\n① 已通知维修师傅，预计 13:00 前处理\\n② 203 今日暂停接受新预订\\n③ 当前住客已安排换至 206（同型房，已确认无异议）\\n\\n维修完成后会自动恢复上架 ✅\", \"type\": \"ai\"}]}, {\"label\": \"客服端\", \"messages\": [{\"text\": \"有客人在美团给了4分，说早餐种类太少\", \"type\": \"user\"}, {\"text\": \"⚠️ 已收到差评预警：美团 4分\\n\\n📝 建议回复（30秒内回复可降低影响）：\\n\\n「感谢您的入住和反馈！非常抱歉早餐种类未能满足您的期待。我们已将您的建议反馈给厨房团队，下周起将新增3款早餐选项。希望有机会再次为您服务，届时将为您准备专属欢迎礼 🙏」\\n\\n是否发送此回复？\", \"type\": \"ai\"}, {\"text\": \"发送，顺便记录一下早餐问题\", \"type\": \"user\"}, {\"text\": \"✅ 回复已发送\\n📝 早餐改善建议已记录并发送给餐饮负责人\\n\\n本月差评汇总：\\n• 早餐种类（3次）⚠️ 高频问题\\n• 停车位不足（1次）\\n• WiFi 信号（1次）\\n\\n早餐问题连续出现，建议本周内落实改善方案\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53'),(429,NULL,'美容美发连锁 AI 运营助手','beauty-salon-ai-ops',199.00,'专为美容美发连锁门店打造的全链路 AI 运营系统。核心理念：「预约不爽约 + 顾客精准维护 + 技师产能最大化」，解决美业门店爽约率高、会员流失追踪难、技师排班冲突三大痛点。\n\n涵盖六大功能模块：\n① AI 预约管理（微信预约+智能提醒，爽约率降低 60%）\n② 顾客档案系统（发质/肤质/偏好/消费全记录）\n③ 技师排班优化（客流预测+技师专长双匹配）\n④ 会员营销自动化（生日关怀/到期提醒/沉睡唤醒）\n⑤ 产品库存管理（低库存预警+畅销品分析）\n⑥ 门店数据看板（预约率/技师产能/会员活跃度）\n\n适用场景：美发店、美容院、美甲店、综合美业门店，单店/连锁均可部署，接入企业微信当天上线。','https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop','available','行业方案',NULL,'[{\"label\": \"老板端\", \"messages\": [{\"text\": \"本月业绩怎么样，哪个技师最好\", \"type\": \"user\"}, {\"text\": \"📊 本月经营简报（截至今日）\\n\\n总营业额：¥128,400（↑9% vs 上月）\\n服务人次：486 次　客单价：¥264\\n会员复购率：71%✅\\n\\n👑 技师排名：\\n🥇 小美　¥38,200　118 人次（预约排队 3 天）\\n🥈 阿杰　¥31,600　97 人次\\n🥉 小林　¥28,800　89 人次\\n\\n💡 小美严重超负荷，建议提价 20% 或培养助理接单\", \"type\": \"ai\"}, {\"text\": \"本月有多少会员快到期了\", \"type\": \"user\"}, {\"text\": \"📊 会员到期预警：\\n\\n本月到期：43 人　本周到期：12 人\\n\\n⚠️ 高价值会员（余额 ¥500+）即将到期：7 人\\n\\n💡 建议立即对这 7 人发送专属续费优惠，历史数据显示此类挽留成功率 78%\\n\\n是否现在生成并发送续费消息？\", \"type\": \"ai\"}]}, {\"label\": \"技师端\", \"messages\": [{\"text\": \"下午两点的刘太太来了，她之前做过什么\", \"type\": \"user\"}, {\"text\": \"📋 顾客档案：刘慧萍　VIP会员\\n\\n上次服务：3月12日（25天前）\\n项目：烫发（日系小卷）+ 护理\\n发质：受损发质，对氨水敏感⚠️\\n偏好：不喜欢发型太高，喜欢自然感\\n\\n历史消费：¥8,640　到访 22 次\\n\\n💡 本次建议推荐：修护焗油（上次烫后应做，她还未做）\", \"type\": \"ai\"}, {\"text\": \"做完了，帮我记录一下今天的服务\", \"type\": \"user\"}, {\"text\": \"请简单描述今天做了什么，我来录入：\", \"type\": \"ai\"}, {\"text\": \"剪发+修护焗油，她对今天效果很满意\", \"type\": \"user\"}, {\"text\": \"✅ 服务记录已更新：\\n剪发（自然卷修型）+ 修护焗油\\n顾客满意度：⭐⭐⭐⭐⭐\\n\\n📲 已发送护发小贴士给刘太太\\n🗓️ 建议下次回访：30天后（5月6日）\\n\\n自动提醒已设置，届时将推送给刘太太 ✅\", \"type\": \"ai\"}]}, {\"label\": \"前台端\", \"messages\": [{\"text\": \"有个新客人想预约明天烫发，哪个技师有空\", \"type\": \"user\"}, {\"text\": \"明日烫发可约技师：\\n\\n• 阿杰　10:00 / 14:00 有档（烫发专长 ⭐⭐⭐⭐⭐）\\n• 小林　11:00 有档（烫发专长 ⭐⭐⭐⭐）\\n\\n小美明日全天约满 ❌\\n\\n请问客人偏好哪位，或有特别要求？\", \"type\": \"ai\"}, {\"text\": \"阿杰，下午两点\", \"type\": \"user\"}, {\"text\": \"✅ 已为新客预约：\\n阿杰　明日 14:00　烫发\\n\\n📲 预约确认短信已发送给客人\\n⏰ 明日 12:00 将自动发送提醒，降低爽约率\\n\\n请问客人姓名和手机号？方便建立档案\", \"type\": \"ai\"}]}]','2026-04-05 21:52:53','2026-04-05 21:52:53');
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_11_29_220023_create_personal_access_tokens_table',1),(5,'2025_11_29_220222_create_posts_table',1),(6,'2026_02_28_175953_create_listings_table',1),(7,'2026_02_28_224010_create_sourcing_requests_table',1),(8,'2026_02_28_230647_add_fields_to_posts_table',1),(9,'2026_03_01_002224_add_profile_fields_to_users_table',1),(10,'2026_03_01_003011_add_user_id_to_listings_table',1),(11,'2026_03_01_003843_create_purchases_table',1),(12,'2026_03_01_100000_create_payment_orders_table',2),(13,'2026_03_05_212053_add_demo_messages_to_listings_table',3),(14,'2026_03_24_172740_create_industry_solutions_table',4),(15,'2026_04_06_053148_add_demo_personas_to_listings_table',5);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_orders`
--

DROP TABLE IF EXISTS `payment_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  `stripe_session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_orders_stripe_session_id_unique` (`stripe_session_id`),
  KEY `payment_orders_user_id_foreign` (`user_id`),
  KEY `payment_orders_listing_id_foreign` (`listing_id`),
  CONSTRAINT `payment_orders_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payment_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_orders`
--

LOCK TABLES `payment_orders` WRITE;
/*!40000 ALTER TABLE `payment_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','efe1ea6d8845d5893f296921601666f739486be909eb8862ace33e56f8235ec4','[\"*\"]','2026-02-28 22:07:09',NULL,'2026-02-28 19:48:48','2026-02-28 22:07:09'),(2,'App\\Models\\User',1,'auth_token','fce743fe4829b4a7a24b4fbd22042b6ca2be53768b3e0cd76a4a75d42fb81a10','[\"*\"]','2026-02-28 21:50:48',NULL,'2026-02-28 21:48:09','2026-02-28 21:50:48'),(3,'App\\Models\\User',1,'auth_token','5102655dada1969b81228acfa3f22eda587837a70364c59c8e4903eaca0ec8da','[\"*\"]','2026-02-28 21:58:10',NULL,'2026-02-28 21:50:49','2026-02-28 21:58:10'),(4,'App\\Models\\User',1,'auth_token','92480c1d2de38be94ba243553307b588a0b04204ee7c857feffb653322c4b210','[\"*\"]','2026-02-28 22:04:27',NULL,'2026-02-28 21:58:12','2026-02-28 22:04:27'),(6,'App\\Models\\User',1,'auth_token','795c0c5cdbef9ee016c7e01e4854cda5535a90debe7e90f1bb3d80c583647911','[\"*\"]','2026-03-05 07:50:32',NULL,'2026-03-05 07:50:07','2026-03-05 07:50:32'),(7,'App\\Models\\User',1,'auth_token','f0bb08620a9cf0ee8f6a761a951029eb1ab05975647a5a2576e853aed330f2e6','[\"*\"]','2026-03-05 14:53:00',NULL,'2026-03-05 14:49:49','2026-03-05 14:53:00'),(8,'App\\Models\\User',7,'auth_token','5b0176db7e338cfe36105d09acf108afa4293d251018706d9fac9d81e4200bc4','[\"*\"]','2026-03-15 09:09:26',NULL,'2026-03-14 00:19:42','2026-03-15 09:09:26'),(9,'App\\Models\\User',8,'auth_token','9c6c89cb5ce0c7127b9346d78fe0402063b9cfbcf478f593dc7383a7934a4b01','[\"*\"]','2026-03-17 02:00:04',NULL,'2026-03-14 03:07:59','2026-03-17 02:00:04'),(10,'App\\Models\\User',9,'auth_token','b196ccfb3d9c32086d82d3af9ed2415eb2f47c7b19b06ee323618c5a797a50a4','[\"*\"]','2026-03-15 04:54:56',NULL,'2026-03-15 04:54:47','2026-03-15 04:54:56'),(11,'App\\Models\\User',1,'auth_token','536fca84eb14ba0379cbf370a615f29b7ea5b18b45925e745c108b5e6f145181','[\"*\"]','2026-03-15 20:32:46',NULL,'2026-03-15 20:32:07','2026-03-15 20:32:46'),(12,'App\\Models\\User',1,'auth_token','afeeeddd60e90de7e6a347f5e95db7da982085c00bffc59603c03ebc5337a6a7','[\"*\"]','2026-03-24 15:49:20',NULL,'2026-03-20 18:17:02','2026-03-24 15:49:20'),(13,'App\\Models\\User',10,'auth_token','2ca9baffb1ad67967da9ac0e23d13347fed3ca98b6f2339741e920d175dd1f9e','[\"*\"]','2026-03-22 17:17:31',NULL,'2026-03-22 17:14:48','2026-03-22 17:17:31'),(14,'App\\Models\\User',11,'auth_token','a9502ea430ed3671de2eabfb83438696ff42ecaa2b3728b28a9f5d0e424045b3','[\"*\"]','2026-03-26 01:04:43',NULL,'2026-03-23 01:07:28','2026-03-26 01:04:43'),(15,'App\\Models\\User',1,'auth_token','be772d797b45b38be041c1bebda287a27f932c1b6944350ac29bb80959a2277b','[\"*\"]','2026-03-25 19:06:44',NULL,'2026-03-23 22:08:42','2026-03-25 19:06:44'),(16,'App\\Models\\User',1,'auth_token','83606c02ac29bdf55e3c0678fa10815aab2be3473610a611df13c111c5ecc432','[\"*\"]','2026-03-23 23:54:49',NULL,'2026-03-23 23:54:03','2026-03-23 23:54:49'),(17,'App\\Models\\User',12,'auth_token','9cb02ea484b30a657281225c59493314b9e3a7c11b1d3b912ec3f7f14db152f1','[\"*\"]','2026-03-24 21:18:57',NULL,'2026-03-24 21:17:46','2026-03-24 21:18:57'),(18,'App\\Models\\User',13,'auth_token','33efa311dceb9a3bee21c72c16f0d67523b384013a370cb19c8a0524c8a775d6','[\"*\"]','2026-03-29 06:32:26',NULL,'2026-03-28 20:14:42','2026-03-29 06:32:26'),(19,'App\\Models\\User',14,'auth_token','65e55f2f95a989b095efcedf0b6948e1044a4e08f4ae7de14fe6e81af45cd25f','[\"*\"]','2026-04-01 00:01:20',NULL,'2026-03-31 23:56:55','2026-04-01 00:01:20'),(20,'App\\Models\\User',15,'auth_token','711414895a74e8e7b5724ae55caaafbb1f4826a3e18ef972c346d371394c87f4','[\"*\"]','2026-04-01 19:28:48',NULL,'2026-04-01 19:28:35','2026-04-01 19:28:48'),(21,'App\\Models\\User',16,'auth_token','557bfa500a74859fc09634b351af350cbe66501da02463f9f4e3f163139470d5','[\"*\"]','2026-04-01 23:01:02',NULL,'2026-04-01 21:45:00','2026-04-01 23:01:02'),(22,'App\\Models\\User',17,'auth_token','b30dbd0d3e1563ecc68261a8dbb104ebe6bccd84e0b7cae78618226ba5a74e9b','[\"*\"]','2026-04-02 04:51:09',NULL,'2026-04-02 04:47:43','2026-04-02 04:51:09'),(23,'App\\Models\\User',18,'auth_token','86a80b361efb013d0fcac963c521157e44b2fe62d7eb6a373845ac11c439999e','[\"*\"]','2026-04-06 01:05:27',NULL,'2026-04-03 16:24:07','2026-04-06 01:05:27');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_user_id_foreign` (`user_id`),
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'Molestias rerum blanditiis nesciunt incidunt sed ex.','Totam sapiente explicabo necessitatibus nostrum laborum. Eius et cupiditate sint veritatis numquam non praesentium. Aut odit impedit eaque laboriosam. Facilis et quis alias et distinctio corrupti voluptate quia.\n\nQuae molestiae minima porro minus. Voluptatibus et quisquam amet consectetur nulla eligendi. Qui voluptas quae itaque eos sequi eum. Ut quis fugiat adipisci molestiae ex.\n\nQuia nostrum tenetur dolores quisquam et. Provident possimus placeat delectus ipsa magnam praesentium. Commodi aliquid reprehenderit maxime placeat repudiandae nihil.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(2,1,'Qui vitae aut enim sed nihil vel.','Voluptas eveniet dolorem id odit hic sunt. Error aliquam qui sapiente ut sed molestias alias. Laborum veritatis necessitatibus occaecati ut hic id ut.\n\nOccaecati ut quis perspiciatis quasi est. Dolor architecto et fugiat dolore maiores cum. Molestias ad necessitatibus voluptatibus soluta nesciunt. In ipsam et rem totam perferendis.\n\nAut blanditiis eaque pariatur laborum qui. Aut in eos ullam eos corrupti sint. Provident nihil tempora aut sunt ipsum. Quidem sunt eos dolor expedita.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(3,1,'Ab dolorum aperiam animi doloribus ullam temporibus.','Molestiae ipsum enim fugiat perferendis. Repellat pariatur dolores doloribus et quam libero. Quia ratione asperiores enim aspernatur modi repudiandae qui. Non quisquam natus nemo occaecati.\n\nAutem voluptatem molestiae ut nisi ut odio. Eos omnis corrupti maiores enim.\n\nPraesentium autem reprehenderit quod pariatur nesciunt voluptas iusto. Reprehenderit dolor quos quia nostrum id aspernatur saepe. Necessitatibus et itaque laborum nemo eius aliquam. Et at nulla modi est facilis.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(4,1,'Itaque quis dolores ut sit dolore.','Repellendus sed laudantium a fugit ut et inventore. Quis expedita laudantium sed. Voluptatem voluptate commodi rerum.\n\nMolestias voluptates quis tempora aut et sequi. Molestiae quam quia ipsa voluptatem nihil alias.\n\nFacere et sed praesentium consequatur et. Voluptas temporibus molestiae reiciendis dolorem itaque.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(5,1,'Expedita vel pariatur aut qui.','Deleniti natus possimus animi voluptatum est. Doloribus a numquam asperiores. In aut sunt corporis fugiat.\n\nExplicabo aut nihil excepturi autem aut. Alias maxime vel aperiam ea error adipisci molestiae. Nam sit et aut ullam et.\n\nVoluptatem quis dolores in molestias aut eos. Dignissimos et et velit. Rerum molestiae corrupti incidunt sint sequi. Temporibus in illo quos sapiente debitis quidem assumenda.',0,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(6,2,'Voluptatem recusandae quia sed quasi necessitatibus adipisci.','Veritatis eveniet eveniet similique accusamus qui. Non ea aliquam maxime possimus. Perspiciatis qui quaerat earum dolorum sit est fugit ut.\n\nNon et officiis nobis laboriosam neque rerum. Vel ut possimus aliquam qui in deserunt est. Ea itaque velit sed quis debitis vel architecto. Dolores minima unde facilis aut recusandae sunt.\n\nIure debitis et porro aut quod error natus et. Quaerat similique ipsa explicabo dolor eligendi iusto. Aperiam optio dolorum delectus dignissimos dolores sunt quos esse.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(7,2,'Voluptatibus eum facilis vel porro.','Animi cum et temporibus ad qui architecto explicabo repudiandae. Neque sit omnis omnis asperiores quam et qui. Illum sunt recusandae sequi molestias labore.\n\nUt dolorem aut cum odio. Itaque nisi tenetur est. Delectus rem iure reprehenderit illum autem vel iusto.\n\nSint est cupiditate ab error. Minima provident quos voluptate cum ut quis neque. Illo quam alias consequuntur nulla alias ex.',0,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(8,2,'Quia rerum sapiente adipisci est illum.','Blanditiis velit numquam omnis eos doloribus et illo. Et similique est minima et laboriosam. Alias a voluptatum voluptatum qui fugit. Assumenda ut blanditiis recusandae consequuntur similique.\n\nA suscipit autem rem officiis. Repellat dolorum quod dolorem quia accusantium sequi. Iusto sint pariatur in repellat.\n\nQuod animi aut saepe. Rerum sed veniam quia autem cum. Cumque in dolor vel architecto expedita. Dolorum non officia sed.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(9,2,'Sunt labore et minus qui et temporibus.','Error ut illo minus dolorem perferendis. Laudantium quidem iure expedita. Voluptatem minima nisi ipsam iusto ducimus quaerat necessitatibus.\n\nUt est possimus voluptas repudiandae iure aut. Recusandae non architecto tempore facilis dolore ea autem. Nobis fuga quis nemo quisquam recusandae quo.\n\nIpsum molestiae culpa consequatur reiciendis. Dolorem quibusdam voluptatibus quod est. A qui dignissimos quia non. Repellat et nisi ea.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(10,2,'Facere et saepe laborum incidunt.','Excepturi est impedit sint reprehenderit expedita. Consequatur id sed exercitationem fugiat nihil. Ut atque fugit officia molestiae nobis.\n\nMolestias autem blanditiis dignissimos aspernatur et occaecati. Et nemo quas voluptas maiores qui odio. Animi aut voluptatem voluptatem ipsum ut. Reprehenderit rem cupiditate et beatae voluptas delectus. Voluptate ipsam omnis reiciendis nobis.\n\nConsequuntur natus aut rerum ea. Ipsa odio quisquam explicabo amet laboriosam veniam sapiente. Velit repellat rerum velit necessitatibus tempora pariatur expedita.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(11,3,'Omnis itaque quis sit adipisci aut illo sequi nihil.','Eius aut architecto dolorem adipisci doloremque exercitationem. Qui dolore pariatur nostrum labore.\n\nSint suscipit optio eveniet et veritatis. Rerum est ab harum dolor enim. Et omnis enim quibusdam voluptas voluptatem quibusdam. Explicabo accusantium aliquam molestiae consequuntur suscipit.\n\nAut magnam incidunt rerum eum. Et qui qui fuga dolorem. Porro et nobis consequatur in voluptatibus ullam aut. Officiis eum qui quae asperiores rerum voluptatem est qui.',0,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(12,3,'Recusandae numquam sequi molestias cumque.','Exercitationem soluta sunt et libero voluptas voluptatum ut. Quis quo nihil pariatur commodi fuga ut beatae aut.\n\nPraesentium qui et at voluptas. Voluptatum perferendis rerum sunt placeat aut qui dignissimos ut. Explicabo veritatis beatae maxime provident. Blanditiis aut minus placeat suscipit. Laudantium doloribus dolorem aut provident.\n\nEnim officia veritatis at. Culpa doloribus cum quae qui dolor eveniet amet. Quia delectus impedit itaque ratione dicta temporibus. Sapiente eum ipsam quos totam.',0,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(13,3,'Provident est possimus laudantium quam ut.','Voluptatem id ullam ea qui nulla est in nam. Eum tempora numquam quia ab. Quia quis blanditiis voluptates nobis officia nesciunt.\n\nDolores velit amet eius est tenetur laborum exercitationem qui. Harum dicta et molestiae explicabo.\n\nSed deserunt pariatur nemo culpa quis aut. Velit iure dolores est dolorum. Voluptas illo sit voluptates quasi eligendi.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(14,4,'Perferendis totam labore aut tempore accusantium.','Rerum laboriosam voluptatem magnam. Optio dolor illum libero animi temporibus ducimus. Blanditiis sint iste dolore dolore aut dolor omnis.\n\nRepellat impedit veritatis nostrum ipsam est nihil nihil nemo. Ut temporibus est sed dolor vel molestias. Exercitationem asperiores dolor autem ab eos. Mollitia excepturi ut dolores voluptatem et eius unde.\n\nTemporibus aut hic quos dicta eligendi. Debitis quas voluptas consequuntur vel eius. Itaque similique iste vel est enim distinctio magni. Repellat eius debitis deleniti hic reiciendis ea.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(15,4,'Error non quo rerum natus ut voluptate omnis.','Rerum nam dolorum possimus aut. Veniam soluta sapiente ad. Sit quisquam vel et reprehenderit eaque et. Labore sed dicta autem quam consectetur vel non et. Unde qui qui error qui consequatur et sapiente.\n\nVoluptatem suscipit delectus sed architecto et praesentium et. Est eum tempora odio est. Occaecati veritatis ex ut quasi laborum. Est dolor voluptate voluptatum similique aut non quia. Qui modi sunt ratione quas occaecati soluta.\n\nDoloremque assumenda saepe error optio incidunt. Harum a sed aut ut qui. Deserunt architecto eos recusandae sint id reprehenderit.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(16,4,'Sit officia beatae aut.','Repellat perferendis iste quas possimus. Nihil dolorum quia similique. Sunt est cum ut et. Beatae corrupti quisquam cum adipisci ut.\n\nNam provident doloribus aut facere. Necessitatibus perferendis dolores labore maiores exercitationem totam inventore. Molestiae rerum consequatur provident.\n\nExplicabo possimus nostrum aut non qui est maxime. Reiciendis et vero laborum eum aut porro. Id nam illo aut eum.',0,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(17,5,'Accusamus animi et dicta occaecati.','Eos neque minima ea vitae. Placeat tempore quas quis deserunt rem doloribus. Laborum saepe sed necessitatibus et.\n\nNatus blanditiis voluptatem consectetur eveniet iusto ut. Nulla ad blanditiis ut consequuntur. Reprehenderit consequatur quaerat sint velit omnis necessitatibus corporis. Nam adipisci officiis consequuntur cum libero odit saepe.\n\nMolestiae iure rerum illo ratione non omnis. Sunt aut quia iste rerum et inventore. Dicta vel et accusantium qui porro et. Voluptas voluptatem magni ea facilis harum nisi.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(18,5,'Et qui totam aut nam nihil natus ipsa quasi.','Molestiae in voluptate quas ipsa. Quisquam perspiciatis temporibus sequi dolorem voluptatibus voluptatum vitae. Repellat necessitatibus a ipsa.\n\nVoluptatem molestias pariatur omnis quod. Alias ipsa aspernatur voluptatem quia. Autem cum nobis inventore perferendis laborum eius cupiditate.\n\nAlias inventore nesciunt dolores ut ad nesciunt aspernatur. Incidunt incidunt laboriosam excepturi vel ea.',0,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(19,5,'Ducimus occaecati quod officiis aut tenetur soluta.','Aperiam suscipit nostrum voluptate et. Et ut corrupti sed blanditiis. Ducimus assumenda eum rerum expedita. Voluptatum temporibus delectus nulla et vero qui recusandae. Qui cum aut nam impedit in sed sequi.\n\nEst dolores exercitationem cum ea. Sapiente aut non accusamus iste consectetur. Sint perspiciatis fugit mollitia tempore aliquid quam sed blanditiis. Esse impedit neque provident architecto consequatur et aliquid. Architecto et ut eos.\n\nEum minus voluptatem quasi sed quasi nihil ipsa. Omnis provident repellendus aut id sit et minima. Quam quas libero molestiae magnam adipisci labore vitae maxime. Delectus corporis sint nesciunt. Recusandae quas quo enim magni.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(20,5,'Sunt dicta sapiente molestiae commodi id neque non.','Corrupti quo pariatur voluptatibus optio placeat laudantium nulla possimus. Consectetur nulla voluptatem quis voluptate veritatis aliquid dolore. Est non deserunt ut. Facilis aspernatur non voluptatem vel qui.\n\nOdio cumque suscipit voluptatem expedita qui quis odit. Omnis aperiam qui ducimus ut aspernatur. Qui maxime rem aut eaque voluptas sed nam.\n\nCorporis velit doloremque dolorem consequatur. Dicta quaerat similique non ut repudiandae saepe. Vel cumque laboriosam fugiat tenetur rerum similique veniam.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(21,6,'Molestiae vel enim voluptatem aut minima reprehenderit praesentium cum.','Nostrum adipisci dolorem dolorum iure vel. Aut et eius at assumenda consequatur soluta. Quas ullam magnam repellat ullam temporibus impedit.\n\nArchitecto qui nihil saepe similique ducimus. Sunt quis eaque et occaecati. Qui et assumenda earum blanditiis eos.\n\nOdio impedit asperiores voluptas velit aperiam consequatur sed. Vel iusto in sed debitis. Reprehenderit vel sit impedit.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(22,6,'Placeat explicabo veniam qui id rerum excepturi.','Ab sit officiis in dolorem. Aut error voluptas possimus minima. Non sint aut delectus maiores ut.\n\nAspernatur sit officia ipsum architecto. Tempora aut tenetur quod similique eaque magni. Voluptates dolorem sed commodi maxime doloremque.\n\nVoluptatum et in dolorem. Sint ut quasi autem blanditiis consectetur libero placeat placeat. Ea consequatur provident non qui voluptatibus. Voluptatem nihil quia totam doloremque quibusdam.',0,'2026-02-28 19:29:03','2026-02-28 19:29:03'),(23,6,'Rerum asperiores laboriosam odio totam.','At est suscipit praesentium cumque debitis deserunt. Occaecati cumque ut itaque voluptatum id quia. Doloribus enim voluptatem molestias autem provident. Iusto omnis velit ut sit in sit. Est similique sed voluptate quo consectetur fugiat qui.\n\nRecusandae autem qui veniam non totam. Aut doloribus qui est cumque. Reprehenderit sed ipsam ducimus repellat minima nihil. Placeat eius voluptas sed perferendis.\n\nExercitationem doloribus dolorem placeat illo omnis blanditiis sint. Debitis necessitatibus est explicabo beatae sint debitis eaque. Quasi quia quae ratione cupiditate.',1,'2026-02-28 19:29:03','2026-02-28 19:29:03');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  `price_paid` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchases_user_id_listing_id_unique` (`user_id`,`listing_id`),
  KEY `purchases_listing_id_foreign` (`listing_id`),
  CONSTRAINT `purchases_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchases_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('8r7WFrl4kof8M8ts6IvBRsrEoOxWgzJ9tod6w1kc',NULL,'162.158.108.5','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVThWY1pmcEtEQjhGc1Q5R2k2UE1yZUMzSm1WZjhLSDVUZkVMUVBYRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775459488),('A1JVQTq1J3LmsaRNyGhP1iOPVQNuctzczWIZQeDi',NULL,'162.159.98.152','Mozilla/5.0 (Linux; Android 15; MEIZU 22 Build/AQ3A.250411.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/146.0.7680.153 Mobile Safari/537.36 XWEB/1460043 MMWEBSDK/20260201 MMWEBID/3517 REV/6493d2d8112586fe90aee92f6cf15a989bc4e69f MicroMessenger/8.0.69.3040(0x2800455A) WeChat/arm64 Weixin NetType/4G Language/zh_CN ABI/arm64','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTFdmQW9WeTFMRkM3eDZpeTMzanFtdXZ1cDhZTm8zS2xEQ2JQM3FMTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775463748),('auc1UW8VNT8JeWrLqh6DiAJ8n31rteYaJ6gnEIvL',NULL,'162.158.186.145','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.56(0x1800383b) NetType/WIFI Language/zh_CN','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3FpVTNFZU1WeERZa1NRMkdSb0JoUkZXSk0wdDBnVHdxNkdUb1NqWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjA6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncy9mcmVzaC1tYXJrZXQtYWktbWFuYWdlciI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1775462877),('eaEc49XR1HQ97RGg2Kr4T0k8PonThZnozdFtTOpF',NULL,'172.71.102.105','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidU9MaERjZUg1OUxhZnVhZ3d5VmlnRXJLNnJnV09PdE9PdmxjcDllbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775466409),('KIH0NatmVPNS9Rk8qe89oVt0l9dqKhn58dXtQwtN',NULL,'162.158.179.174','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiczRacmdlNXFTVUprdUhUczJMTjlpUXJpMzZwQ2FCRTBrWG56cWVJZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775466197),('LbJwy4nn8pIXpCDy5hpbd5mbc8Mp3gPsozplqHuP',NULL,'162.159.98.153','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2lZNzE3elhHQ3piRFByelNEaERiSEJRTVhVS254ZXZnWUpDaXBUTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775466436),('O0ERaEx8IaClmoKteoE829dZIUZRVFbvhXpZOwfm',NULL,'104.23.170.10','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Mobile Safari/537.36 MicroMessenger/7.0.1','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjZvUFU2R0FwMkFaVlc3djU0b0hpTlY0THBjZU42RlZHd005ZVRiUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjA6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncy9mcmVzaC1tYXJrZXQtYWktbWFuYWdlciI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1775462213),('ql5RVnkr0yk80RKBYbjNjIVGm2LZIhnSWLjavlar',NULL,'172.71.182.133','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlE2U1R6M0pyRnU5WTAySUVxVDJnMlQ0bkUydkFhaXIwQU9GM251YyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775466487),('QXP2K1w6vQCiz8H0LVaiv53Bi5emUv2ktX14Hn5g',NULL,'162.158.88.69','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMjVJNFRad2k1WlRCUmgzUXVkbEZmVTlpVGlBSEdCRThoME1haHFoYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775459488),('TTVceuAHbE7BKfyD8VYiQpV7jkOKwX1tWHeK7cwX',NULL,'162.158.178.205','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2EzUXl6WGhnd01hZkw5MVNObGt3SnY3UFJjVlZBbjlNWDFlWnU1ZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775466168),('y3fmGx4Ns74DRAMAmlggesIZP63BNm7CIFnLmIo3',NULL,'162.159.98.152','Mozilla/5.0 (Linux; Android 15; MEIZU 22 Build/AQ3A.250411.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/146.0.7680.153 Mobile Safari/537.36 XWEB/1460043 MMWEBSDK/20260201 MMWEBID/3517 REV/6493d2d8112586fe90aee92f6cf15a989bc4e69f MicroMessenger/8.0.69.3040(0x2800455A) WeChat/arm64 Weixin NetType/4G Language/zh_CN ABI/arm64','YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2Rpc2ZwYXNob0pFTDVaMWpwaGFCcFd1VkpBT3ZEQjkxM2EyUHVrMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775463748);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sourcing_requests`
--

DROP TABLE IF EXISTS `sourcing_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sourcing_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sourcing_requests`
--

LOCK TABLES `sourcing_requests` WRITE;
/*!40000 ALTER TABLE `sourcing_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `sourcing_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_seller` tinyint(1) NOT NULL DEFAULT '0',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Demo User','demo@example.com',NULL,NULL,NULL,0,'2026-02-28 19:29:02','$2y$12$TJQhbh2Ivy8DwG85UqGeEuQIZKm6dQ018p/QL4wCeeo80VUuQSFpi','kM0YmGDr7V','2026-02-28 19:29:03','2026-04-04 20:42:26'),(2,'霍杰','consectetur_quas@example.com',NULL,NULL,NULL,0,'2026-02-28 19:29:03','$2y$12$E9Yq9xrkjX6L7en/iovmBeNDUWA9wOK03d/hprN/R2MjdxBtWFBLy','drWFft6p6k','2026-02-28 19:29:03','2026-02-28 19:29:03'),(3,'巫晨','autem.fugiat@example.net',NULL,NULL,NULL,0,'2026-02-28 19:29:03','$2y$12$E9Yq9xrkjX6L7en/iovmBeNDUWA9wOK03d/hprN/R2MjdxBtWFBLy','99TNHEsYpD','2026-02-28 19:29:03','2026-02-28 19:29:03'),(4,'仇雪梅','quia.illo@example.org',NULL,NULL,NULL,0,'2026-02-28 19:29:03','$2y$12$E9Yq9xrkjX6L7en/iovmBeNDUWA9wOK03d/hprN/R2MjdxBtWFBLy','aQni4c09kc','2026-02-28 19:29:03','2026-02-28 19:29:03'),(5,'柯鹰','quia31@example.net',NULL,NULL,NULL,0,'2026-02-28 19:29:03','$2y$12$E9Yq9xrkjX6L7en/iovmBeNDUWA9wOK03d/hprN/R2MjdxBtWFBLy','0P5Oxt54ez','2026-02-28 19:29:03','2026-02-28 19:29:03'),(6,'马明','illo73@example.org',NULL,NULL,NULL,0,'2026-02-28 19:29:03','$2y$12$E9Yq9xrkjX6L7en/iovmBeNDUWA9wOK03d/hprN/R2MjdxBtWFBLy','SGXr1efiro','2026-02-28 19:29:03','2026-02-28 19:29:03'),(7,'Jason','gideon.opc@outlook.com',NULL,NULL,NULL,1,NULL,'$2y$12$hW.uTphVTm6GKEnSeCSfH.dEphJC4cQmlYgIRrOFZr767Y3.W.Oce',NULL,'2026-03-14 00:19:42','2026-03-14 00:20:14'),(8,'AK','2360997760@qq.com',NULL,NULL,NULL,1,NULL,'$2y$12$VNf7pt5a1QmrcebsJWd.UODW/vzaia.fsasim2jvh/FB8XhN2..nG',NULL,'2026-03-14 03:07:59','2026-03-14 03:08:58'),(9,'niy','yinhongdl@gmail.com',NULL,NULL,NULL,0,NULL,'$2y$12$jS8WAiJl11ZImngnAePtKeZ5pXFFSyFleFn0grTcg0D88r00LYLUW',NULL,'2026-03-15 04:54:47','2026-03-15 04:54:47'),(10,'dk_liu','dk_liu@163.com',NULL,NULL,NULL,0,NULL,'$2y$12$yaG2szgBL7Y.ErRq4riYqOuAh55E0Qembby32WB61ZOPUfqqrdgUe',NULL,'2026-03-22 17:14:48','2026-03-22 17:14:48'),(11,'Jun','215184812@qq.com',NULL,NULL,NULL,1,NULL,'$2y$12$ix9wNQ7fX08nsWVi3ZJ7VeFnyAushfbVnB/9LIB/oqQwA6XWBQWxa',NULL,'2026-03-23 01:07:28','2026-03-23 01:28:00'),(12,'Travis','yongqi200618@gmail.com',NULL,NULL,NULL,0,NULL,'$2y$12$IT0DLrD1yn82LT5qy1qTGu.qEwJJ9mLMio5zxQIYMSWcHd3OYm47e',NULL,'2026-03-24 21:17:46','2026-03-24 21:17:46'),(13,'阿光','965388636@qq.com',NULL,NULL,NULL,1,NULL,'$2y$12$QqZnODkWyLUYy2e2E3lA0.TsxQBLpMn5UlF0whH3jWSL6BvpuEXIG',NULL,'2026-03-28 20:14:42','2026-03-28 20:14:51'),(14,'老宁','332860594@qq.com',NULL,NULL,NULL,0,NULL,'$2y$12$lp4vYRShrfvQwxTDBUk9JeYa/77fiMav6hCRXWGhXFeyXInil0O.O',NULL,'2026-03-31 23:56:55','2026-03-31 23:56:55'),(15,'李四','toolive@yeah.net',NULL,NULL,NULL,0,NULL,'$2y$12$0IsWZns/yuAF1SAZvFeEHeoIHp7F7E0CRcpNx.eNSHeoRGAwvXs3K',NULL,'2026-04-01 19:28:35','2026-04-01 19:28:35'),(16,'Angus','angus.wang@apright.com',NULL,NULL,NULL,0,NULL,'$2y$12$Wt1mhM6MpNgWwMuCeUoS0.ubN/W.j1ZuJIBPxJUJAsBo2JA0ac85K',NULL,'2026-04-01 21:45:00','2026-04-01 21:45:00'),(17,'guoyn','327227584@qq.com',NULL,NULL,NULL,0,NULL,'$2y$12$YseX3HkVDT4lJpfSkSMBcuEbuoQX2XUm32Z1qX7ZC2esHidXttZWe',NULL,'2026-04-02 04:47:43','2026-04-02 04:47:43'),(18,'david','mixiaobing@gmail.com',NULL,NULL,NULL,0,NULL,'$2y$12$0Lb9KvcWpxhXdAhDDcs4fOkNq7Uvq4Z07dCNYVC9J1SRrnScUpmVO',NULL,'2026-04-03 16:24:07','2026-04-03 16:24:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-06 17:08:10
