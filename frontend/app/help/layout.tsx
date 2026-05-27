import { Metadata } from "next";

export const metadata: Metadata = {
  title: "帮助中心 — 常见问题与使用指南",
  description:
    "Claw Mart 帮助中心：购买问题、退款政策、如何成为卖家、支持哪些支付方式、AI 工具安装指南等常见问题解答。",
  alternates: { canonical: "https://www.clawmart.cn/help" },
  openGraph: {
    title: "帮助中心 — Claw Mart 常见问题",
    description:
      "关于购买、退款、卖家入驻、支付方式和 AI 工具安装的常见问题与解答。",
    url: "https://www.clawmart.cn/help",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "购买后如何获取 AI 员工？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "支付成功后，您可以在「Dashboard → 我的购买」中找到已购商品，点击进入安装页面，按照步骤指引完成部署即可。整个过程通常只需几分钟。",
      },
    },
    {
      "@type": "Question",
      name: "我可以申请退款吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "所有数字商品一经交付即为最终销售，原则上不支持退款。如果您遇到商品无法正常使用或与描述严重不符的情况，请联系我们，我们将为您评估并协助处理。",
      },
    },
    {
      "@type": "Question",
      name: "如何成为卖家并上架我的 AI 员工？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "登录后进入 Dashboard，点击「开始销售」即可申请成为卖家。审核通过后，您可以在「我的销售」中创建和管理商品。",
      },
    },
    {
      "@type": "Question",
      name: "支持哪些支付方式？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "目前支持信用卡/借记卡、支付宝、微信支付，通过 Stripe 安全处理。所有支付均经过加密保护。",
      },
    },
    {
      "@type": "Question",
      name: "购买的 AI 员工可以用在多台设备上吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "购买授予个人使用许可，可在您本人的设备上使用。不得将购买的文件转发、转售或分享给他人。",
      },
    },
    {
      "@type": "Question",
      name: "如何修改我的账户信息？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "登录后进入 Dashboard → 我的设置，可修改昵称、头像、个人网站及简介等信息。",
      },
    },
  ],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://www.clawmart.cn" },
      { "@type": "ListItem", position: 2, name: "帮助中心", item: "https://www.clawmart.cn/help" },
    ],
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
