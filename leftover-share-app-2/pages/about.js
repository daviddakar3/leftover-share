import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Sprout, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F5EFE0] font-sans">
      <Head>
        <title>About — Neighbor's Table</title>
      </Head>
      <header className="bg-[#1F2E22] text-[#F5EFE0] relative overflow-hidden">
        <nav className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex items-center gap-6">
  <Link
    href="/notify"
    className="text-sm font-semibold uppercase tracking-widest text-[#F5EFE0]/80 hover:text-[#F5EFE0] border-b border-transparent hover:border-[#E8A93B] pb-1 transition-colors"
  >
    Notify Me
  </Link>
  <Link
    href="/about"
    className="text-sm font-semibold uppercase tracking-widest text-[#F5EFE0]/80 hover:text-[#F5EFE0] border-b border-transparent hover:border-[#E8A93B] pb-1 transition-colors"
  >
    About
  </Link>
</nav>
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-16 relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3 text-[#E8A93B] text-sm font-semibold uppercase tracking-widest">
            <Sprout size={16} /> Nothing goes to waste
          </div>
          <Link href="/">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F5EFE0] hover:text-[#E8A93B] transition-colors cursor-pointer">
              Neighbor's Table
            </h2>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-[#2A2620] mb-6">About Us</h1>
        <p className="text-[#2A2620]/80 leading-relaxed text-lg">
          Neighbor's Table is an organization founded by David Dakar, a 17-year-old high school
          student, who noticed the large amount of extra food goes untouched at various different events
          that could easily benefit families and shelters in the community. Neighbor's Table is
          dedicated to reducing food waste and strengthening community support. When neighbors
          come together, even a simple act like sharing an extra tray of food; it has the power
          to make a meaningful difference for someone else who is struggling. By making it easier
          to connect extra food with the people who can use it, we hope to build a stronger, more
          generous community, one where nothing good goes to waste and no one has to go hungry.
        </p>
      </main>

      <footer className="border-t border-[#2A2620]/10 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-2 text-sm text-[#2A2620]/50">
          <Users size={15} /> Built to make sure nothing goes to waste.
        </div>
      </footer>
    </div>
  );
}
