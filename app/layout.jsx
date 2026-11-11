import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Portfolio", template: "%s" },
  description: "Personal portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){var r=document.documentElement,d=false;try{d=localStorage.theme===\"dark\"}catch(e){}if(d)r.classList.add(\"dark\");r.dataset.theme=d?\"dark\":\"light\"})()",
          }}
        />
      </head>
      <body className="font-sans antialiased portfolio-bg text-zinc-900 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
