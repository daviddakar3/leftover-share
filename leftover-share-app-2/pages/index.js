import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Phone, Camera, Clock, Plus, X, Utensils, Users, Sprout, Check, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function zipDistance(a, b) {
  const na = parseInt(a, 10);
  const nb = parseInt(b, 10);
  if (isNaN(na) || isNaN(nb)) return 9999;
  return Math.abs(na - nb);
}

function Tag({ children, tone = "sage" }) {
  const tones = {
    sage: "bg-[#7C9473] text-[#F5EFE0]",
    gold: "bg-[#E8A93B] text-[#2A2620]",
    berry: "bg-[#A23E48] text-[#F5EFE0]",
  };
  return (
    <span className={`text-[11px] tracking-wide uppercase font-semibold px-2 py-1 rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}

function ListingCard({ listing, onReveal, revealed, onClaim }) {
  return (
    <div className="relative bg-[#FBF8F0] border border-[#2A2620]/10 rounded-2xl overflow-hidden flex flex-col">
      {listing.claimed && (
        <div className="absolute top-3 right-3 rotate-6">
          <Tag tone="berry">Claimed</Tag>
        </div>
      )}
      <div className="h-36 bg-gradient-to-br from-[#E8A93B]/30 to-[#7C9473]/30 flex items-center justify-center overflow-hidden">
        {listing.photo_url ? (
          <img src={listing.photo_url} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">🍽️</span>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-serif text-xl leading-snug text-[#2A2620]">{listing.title}</h3>
          <p className="text-sm text-[#2A2620]/70 mt-1 leading-relaxed">{listing.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(listing.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#2A2620]/60 mt-auto pt-2 border-t border-[#2A2620]/10">
          <span className="flex items-center gap-1"><MapPin size={13} /> {listing.zip}</span>
          <span className="flex items-center gap-1"><Clock size={13} /> {new Date(listing.created_at).toLocaleString()}</span>
        </div>
        {!listing.claimed && (
          <div className="flex gap-2">
            {revealed ? (
              <a
                href={`tel:${listing.phone.replace(/[^0-9]/g, "")}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1F2E22] text-[#F5EFE0] rounded-full py-2.5 font-semibold text-sm hover:bg-[#2A2620] transition-colors"
              >
                <Phone size={15} /> {listing.phone}
              </a>
            ) : (
              <button
                onClick={() => onReveal(listing.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#E8A93B] text-[#2A2620] rounded-full py-2.5 font-semibold text-sm hover:brightness-95 transition-all"
              >
                <Phone size={15} /> Reveal number
              </button>
            )}
            <button
              onClick={() => onClaim(listing.id)}
              title="Mark as claimed once someone has picked it up"
              className="px-3 rounded-full border border-[#2A2620]/20 text-[#2A2620]/60 hover:bg-[#2A2620]/5 transition-colors"
            >
              <Check size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PostForm({ onSubmit, onClose, submitting }) {
  const [form, setForm] = useState({ title: "", description: "", zip: "", phone: "", tags: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.zip || !form.phone) return;
    onSubmit({ ...form, photoFile });
  };

  return (
    <div className="fixed inset-0 bg-[#1F2E22]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={submit}
        className="bg-[#FBF8F0] rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-[#2A2620]/50 hover:text-[#2A2620]">
          <X size={20} />
        </button>
        <h2 className="font-serif text-2xl text-[#2A2620] mb-1">Post leftover food</h2>
        <p className="text-sm text-[#2A2620]/60 mb-6">A few details so someone nearby can come pick it up.</p>

        <label className="block text-xs font-semibold uppercase tracking-wide text-[#2A2620]/60 mb-1">What is it?</label>
        <input
          value={form.title}
          onChange={update("title")}
          placeholder="e.g. Bar Mitzvah leftovers — brisket & sides"
          className="w-full rounded-lg border border-[#2A2620]/15 px-3 py-2 mb-4 bg-white text-[#2A2620] outline-none focus:ring-2 focus:ring-[#E8A93B]"
          required
        />

        <label className="block text-xs font-semibold uppercase tracking-wide text-[#2A2620]/60 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={update("description")}
          placeholder="How much, how it's packaged, dietary notes, pickup window..."
          rows={3}
          className="w-full rounded-lg border border-[#2A2620]/15 px-3 py-2 mb-4 bg-white text-[#2A2620] outline-none focus:ring-2 focus:ring-[#E8A93B] resize-none"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#2A2620]/60 mb-1">Zip code</label>
            <input
              value={form.zip}
              onChange={update("zip")}
              placeholder="90210"
              maxLength={5}
              className="w-full rounded-lg border border-[#2A2620]/15 px-3 py-2 bg-white text-[#2A2620] outline-none focus:ring-2 focus:ring-[#E8A93B]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#2A2620]/60 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={update("phone")}
              placeholder="(555) 555-5555"
              className="w-full rounded-lg border border-[#2A2620]/15 px-3 py-2 bg-white text-[#2A2620] outline-none focus:ring-2 focus:ring-[#E8A93B]"
              required
            />
          </div>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wide text-[#2A2620]/60 mb-1">Tags (comma separated)</label>
        <input
          value={form.tags}
          onChange={update("tags")}
          placeholder="Vegetarian, Serves 10+"
          className="w-full rounded-lg border border-[#2A2620]/15 px-3 py-2 mb-4 bg-white text-[#2A2620] outline-none focus:ring-2 focus:ring-[#E8A93B]"
        />

        <label className="block text-xs font-semibold uppercase tracking-wide text-[#2A2620]/60 mb-1">Photo</label>
        <label className="flex items-center gap-2 text-sm text-[#2A2620]/70 border border-dashed border-[#2A2620]/25 rounded-lg px-3 py-3 mb-6 cursor-pointer hover:bg-[#2A2620]/5">
          <Camera size={16} />
          {photoPreview ? "Photo selected — click to change" : "Click to add a photo"}
          <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        </label>
        {photoPreview && (
          <img src={photoPreview} alt="preview" className="w-full h-32 object-cover rounded-lg mb-4 -mt-3" />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-[#1F2E22] text-[#F5EFE0] rounded-full py-3 font-semibold hover:bg-[#2A2620] transition-colors disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Posting..." : "Post it"}
        </button>
      </form>
    </div>
  );
}

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zipQuery, setZipQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [banner, setBanner] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setListings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = useMemo(() => {
    let list = [...listings];
    if (zipQuery.trim().length >= 3) {
      list = list
        .map((l) => ({ ...l, _dist: zipDistance(l.zip, zipQuery) }))
        .sort((a, b) => a._dist - b._dist);
    }
    return list;
  }, [listings, zipQuery]);

  const reveal = (id) => setRevealedIds((prev) => new Set(prev).add(id));

  const markClaimed = async (id) => {
    await supabase.from("listings").update({ claimed: true }).eq("id", id);
    fetchListings();
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    let photo_url = null;

    if (form.photoFile) {
      const fileExt = form.photoFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("food-photos")
        .upload(fileName, form.photoFile);
      if (!uploadError) {
        const { data } = supabase.storage.from("food-photos").getPublicUrl(fileName);
        photo_url = data.publicUrl;
      }
    }

    const { error } = await supabase.from("listings").insert({
      title: form.title,
      description: form.description || "No description provided.",
      zip: form.zip,
      phone: form.phone,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      photo_url,
      claimed: false,
    });

    setSubmitting(false);
    setShowForm(false);
    if (!error) {
      setBanner("Your listing is live — thank you for donating instead of tossing it.");
      setTimeout(() => setBanner(null), 5000);
      fetchListings();
    } else {
      setBanner("Something went wrong posting your listing. Please try again.");
      setTimeout(() => setBanner(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE0] font-sans">
      <header className="bg-[#1F2E22] text-[#F5EFE0] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-16 relative z-10">
          <div className="flex items-center gap-2 mb-6 text-[#E8A93B] text-sm font-semibold uppercase tracking-widest">
            <Sprout size={16} /> Nothing goes to waste
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] max-w-2xl">
            The party's over. The food is still good.
          </h1>
          <p className="mt-5 text-[#F5EFE0]/70 max-w-lg text-lg leading-relaxed">
            Post what's left from your event — a bar mitzvah, a wedding, an office lunch —
            and someone nearby, a shelter or a family who needs it, comes to pick it up.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#E8A93B] text-[#2A2620] px-6 py-3 rounded-full font-semibold hover:brightness-95 transition-all"
            >
              <Plus size={18} /> Post leftover food
            </button>
            <a
              href="#browse"
              className="flex items-center gap-2 border border-[#F5EFE0]/30 px-6 py-3 rounded-full font-semibold hover:bg-[#F5EFE0]/10 transition-colors"
            >
              <Utensils size={18} /> Browse what's available
            </a>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 text-[220px] opacity-[0.06] select-none rotate-12">🍞</div>
      </header>

      <main id="browse" className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl text-[#2A2620]">What's available near you</h2>
            <p className="text-sm text-[#2A2620]/60 mt-1">Enter a zip code to sort listings by distance.</p>
          </div>
          <div className="relative w-full sm:w-56">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A2620]/40" size={16} />
            <input
              value={zipQuery}
              onChange={(e) => setZipQuery(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
              placeholder="Your zip code"
              className="w-full pl-9 pr-3 py-2.5 rounded-full border border-[#2A2620]/15 bg-white text-[#2A2620] outline-none focus:ring-2 focus:ring-[#E8A93B]"
            />
          </div>
        </div>

        {banner && (
          <div className="mb-6 flex items-center gap-2 bg-[#7C9473]/15 text-[#3F5237] px-4 py-3 rounded-xl text-sm font-medium">
            <Check size={16} /> {banner}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-[#2A2620]/60 py-12 justify-center">
            <Loader2 size={18} className="animate-spin" /> Loading listings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[#2A2620]/60">
            No listings yet — be the first to post leftover food.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                revealed={revealedIds.has(listing.id)}
                onReveal={reveal}
                onClaim={markClaimed}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[#2A2620]/10 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-2 text-sm text-[#2A2620]/50">
          <Users size={15} /> Built to make sure nothing goes to waste.
        </div>
      </footer>

      {showForm && (
        <PostForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} submitting={submitting} />
      )}
    </div>
  );
}
