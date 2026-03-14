import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-4 py-8 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/privacy" className="hover:text-blue-600">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>
        <p>© {new Date().getFullYear()} AllToolsKit</p>
      </div>
    </footer>
  );
}
