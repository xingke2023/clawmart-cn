import { Metadata } from "next";

export const metadata: Metadata = {
  title: "博客 — AI 工具资讯与使用指南",
  description:
    "Claw Mart 博客：小微企业 AI 工具使用技巧、行业解决方案案例、AI 自动化实践与经验分享。",
  alternates: { canonical: "https://www.clawmart.cn/blog" },
  openGraph: {
    title: "博客 — Claw Mart AI 工具资讯",
    description:
      "小微企业 AI 工具使用技巧、行业解决方案案例与 AI 自动化最佳实践。",
    url: "https://www.clawmart.cn/blog",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Claw Mart 博客",
  url: "https://www.clawmart.cn/blog",
  description: "小微企业 AI 工具使用指南、行业解决方案案例与 AI 自动化实践分享",
  publisher: {
    "@type": "Organization",
    name: "Claw Mart",
    url: "https://www.clawmart.cn",
  },
  inLanguage: "zh-CN",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://www.clawmart.cn" },
      { "@type": "ListItem", position: 2, name: "博客", item: "https://www.clawmart.cn/blog" },
    ],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
