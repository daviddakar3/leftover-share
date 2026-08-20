import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Sprout, Users, Mail, Check, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Notify() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error) {
      setStatus(error.code === "23505" ? "already" : "error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE0] font-sans">
      <Head>
        <title>Get Notified — Neighbor's Table</title>
      </Head>
      <header className="bg-[#1F2E22] text-[#F5EFE0] relative overflow-hidden">
        <nav className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-widest text-[#F5EFE0]/80 hover:text-[#F5EFE0] border-b border-transparent hover:border-[#E8A93B] pb-1 transition-colors"
          >
            Home
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

      <main className="max-w-lg mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-[#2A2620] mb-3">Get notified</h1>
        <p className="text-[#2A2620]/70 leading-relaxed mb-8">
          Enter your email and we'll let you know whenever someone posts new leftover food.
        </p>

        {status === "success" ? (
          <div className="flex items-center gap-2 bg-[#7C9473]/15 text-[#3F5237] px-4 py-3 rounded-xl text-sm font-medium">
            <Check size={16} /> You're subscribed! We'll email you when new food is posted.
          </div>
        ) : status === "already" ? (
          <div className="flex items-center gap-2 bg-[#E8A93B]/15 text-[#8a6a1f] px-4 py-3 rounded-xl text-sm font-medium">
            <Check size={16} /> That email is already subscribed.
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A2620]/40" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-9 pr-3 py-3 rounded-full border border-[#2A2620]/15 bg-white text-[#2A2620] outline-none focus:ring-2 focus:ring-[#E8A93B]"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center justify-center gap-2 bg-[#1F2E22] text-[#F5EFE0] px-6 py-3 rounded-full font-semibold hover:bg-[#2A2620] transition-colors disabled:opacity-60"
            >
              {status === "loading" && <Loader2 size={16} className="animate-spin" />}
              Notify Me
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-sm text-[#A23E48] mt-3">Something went wrong — please try again.</p>
        )}
      </main>

      <footer className="border-t border-[#2A2620]/10 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-2 text-sm text-[#2A2620]/50">
          <Users size={15} /> Built to make sure nothing goes to waste.
        </div>
      </footer>
    </div>
  );
}

