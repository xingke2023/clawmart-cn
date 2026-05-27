import { Metadata } from "next";

export const metadata: Metadata = {
  title: "公司介绍 — 宏泰国际",
  description:
    "宏泰国际 是一家专注于小微企业 AI 工具的香港科技企业，运营 Claw Mart 平台，提供 AI 技能包与行业解决方案。",
  alternates: { canonical: "https://www.clawmart.cn/company" },
  openGraph: {
    title: "公司介绍 — Claw Mart",
    description:
      "宏泰国际：专注小微企业 AI 工具，让每家小微企业都能用上真正好用的 AI。",
    url: "https://www.clawmart.cn/company",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  name: "宏泰国际",
  alternateName: "Claw Mart",
  url: "https://www.clawmart.cn",
  logo: "https://www.clawmart.cn/favicon.png",
  description:
    "专注于小微企业 AI 工具的科技公司，运营 Claw Mart 平台，提供即购即用的 AI 技能包与行业解决方案，致力于帮助小微企业用最低成本获得真正好用的 AI 工具。",
  email: "xiaomi@xingke888.com",
  foundingDate: "2025",
  address: {
    "@type": "PostalAddress",
    addressCountry: "HK",
    addressRegion: "Hong Kong",
  },
  numberOfEmployees: { "@type": "QuantitativeValue", value: "10" },
  knowsAbout: ["小微企业AI工具", "AI技能包", "行业解决方案", "AI自动化", "小微企业数字化"],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://www.clawmart.cn" },
      { "@type": "ListItem", position: 2, name: "公司介绍", item: "https://www.clawmart.cn/company" },
    ],
  },
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
