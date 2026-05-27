import { Metadata } from "next";

export const metadata: Metadata = {
  title: "定制需求 — 找到专属 AI 工具解决方案",
  description:
    "在 Claw Mart 找不到合适的 AI 工具？提交定制需求，我们将为您匹配专属开发者，量身打造符合您小微企业业务场景的 AI 解决方案。",
  alternates: { canonical: "https://www.clawmart.cn/sourcing" },
  openGraph: {
    title: "定制需求 — Claw Mart 专属 AI 解决方案",
    description:
      "提交您的 AI 工具定制需求，由专业开发者为小微企业打造专属解决方案。",
    url: "https://www.clawmart.cn/sourcing",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI 工具定制服务",
  url: "https://www.clawmart.cn/sourcing",
  description:
    "根据小微企业业务需求，由专业开发者量身打造 AI 工具与行业解决方案，提供定制化 AI 自动化服务。",
  provider: {
    "@type": "Organization",
    name: "Claw Mart",
    url: "https://www.clawmart.cn",
  },
  serviceType: "AI 工具定制开发",
  areaServed: { "@type": "Country", name: "China" },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.clawmart.cn/sourcing",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://www.clawmart.cn" },
      { "@type": "ListItem", position: 2, name: "定制需求", item: "https://www.clawmart.cn/sourcing" },
    ],
  },
};

export default function SourcingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
