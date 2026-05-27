import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们 — 小微企业龙虾解决方案提供商",
  description:
    "了解 Claw Mart：我们是专注小微企业的 AI 工具平台，提供即购即用的 AI 技能包与行业解决方案，帮助小微企业用上真正好用的 AI 工具。",
  alternates: { canonical: "https://www.clawmart.cn/about" },
  openGraph: {
    title: "关于 Claw Mart — 小微企业龙虾解决方案提供商",
    description:
      "Claw Mart 是专注小微企业的 AI 工具平台，提供 AI 技能包与行业解决方案，覆盖门店运营、客服、销售、内容创作等场景。",
    url: "https://www.clawmart.cn/about",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "关于 Claw Mart",
  url: "https://www.clawmart.cn/about",
  description:
    "Claw Mart 是专注小微企业的 AI 工具平台，由 HONGKONG MACRODATA TECHNOLOGY LIMITED 运营，提供即购即用的 AI 技能包与行业解决方案。",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://www.clawmart.cn" },
      { "@type": "ListItem", position: 2, name: "关于我们", item: "https://www.clawmart.cn/about" },
    ],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
