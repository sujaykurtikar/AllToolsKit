import Link from "next/link";

import { navigation } from "@/data/tools";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          AllToolsKit
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
