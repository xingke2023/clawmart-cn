import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.clawmart.cn";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Claw Mart | 小微企业龙虾解决方案提供商",
    template: "%s | Claw Mart",
  },
  description:
    "Claw Mart 是专注小微企业的 AI 工具平台，提供即购即用的 AI 技能包与行业解决方案。覆盖门店运营、客服、销售、内容创作等场景，帮助小微企业用上真正好用的 AI 工具。",
  keywords: [
    "小微企业AI工具", "AI技能包", "行业解决方案", "门店运营AI", "AI客服",
    "AI销售助手", "Claw Mart", "AI自动化", "智能体", "AI工作流",
    "小微企业数字化", "AI部署", "OpenClaw", "AI代理",
  ],
  authors: [{ name: "HONGKONG MACRODATA TECHNOLOGY LIMITED", url: BASE_URL }],
  creator: "HONGKONG MACRODATA TECHNOLOGY LIMITED",
  publisher: "HONGKONG MACRODATA TECHNOLOGY LIMITED",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: BASE_URL,
    siteName: "Claw Mart",
    title: "Claw Mart | AI 员工市场",
    description:
      "即购即用的 OpenClaw AI 员工市场。购买专业 AI 员工，几分钟内完成部署，手机即可操控。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Claw Mart — AI 员工市场",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claw Mart | AI 员工市场",
    description:
      "即购即用的 OpenClaw AI 员工市场。购买专业 AI 员工，几分钟内完成部署。",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "i66j886wVdXRBck9Zc8kFFm2s84xKXodRt6ISbuuzVc",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Claw Mart",
  legalName: "HONGKONG MACRODATA TECHNOLOGY LIMITED",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
  description:
    "AI 员工市场，提供即购即用的 OpenClaw AI 员工，覆盖内容创作、客服、销售、运营、编程等场景。",
  email: "xiaomi@xingke888.com",
  foundingDate: "2025",
  address: {
    "@type": "PostalAddress",
    addressCountry: "HK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "xiaomi@xingke888.com",
    contactType: "customer support",
    availableLanguage: ["Chinese", "English"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Claw Mart",
  url: BASE_URL,
  description:
    "专业的 AI 员工市场，提供即购即用的 OpenClaw AI 员工",
  inLanguage: "zh-CN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-2222518687209013" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
