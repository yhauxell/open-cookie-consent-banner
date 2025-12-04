import Link from "next/link";
import { Logo } from "./logo";

const githubUrl = "https://github.com/yhauxell/open-cookie-consent-banner";

export function Footer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const registryUrl = `${baseUrl}/r/cookie-consent.json`;

  return (
    <footer className="border-t bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Logo className="h-5 w-5" />
            <span className="font-medium">Open Cookie Consent</span>
          </div>
          <nav className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link
              href="/docs"
              className="hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/demo"
              className="hover:text-foreground transition-colors"
            >
              Demo
            </Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href={registryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Registry
            </a>
          </nav>
          <p className="text-sm text-muted-foreground">MIT License</p>
        </div>
      </div>
    </footer>
  );
}
