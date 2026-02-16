import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 -mx-8 md:-mx-12 px-8 md:px-12 py-4 mb-[88px] -mt-8 md:-mt-8">
      <div className="flex items-center gap-6 text-neutral-600 font-medium">
        <Link href="/" className="hover:text-neutral-900 transition-colors">
          home
        </Link>
        <Link href="/gallery" className="hover:text-neutral-900 transition-colors">
          gallery
        </Link>
      </div>
    </nav>
  );
}
