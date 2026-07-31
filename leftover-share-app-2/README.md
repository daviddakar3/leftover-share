# Leftover Share — Setup Guide

Follow these steps in order. None of them require a terminal.

## Step A — Create your database (Supabase)

1. Go to https://supabase.com and sign up (free).
2. Click **"New Project."** Name it anything (e.g. `leftover-share`). Set a database password (save it somewhere).
3. Once the project loads, click **"SQL Editor"** in the left sidebar, then **"New query."**
4. Paste in this and click **"Run"**:

```sql
create table listings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  zip text not null,
  phone text not null,
  tags text[],
  photo_url text,
  claimed boolean default false,
  created_at timestamp with time zone default now()
);

alter table listings enable row level security;

create policy "Anyone can view listings" on listings
  for select using (true);

create policy "Anyone can post a listing" on listings
  for insert with check (true);

create policy "Anyone can mark claimed" on listings
  for update using (true);
```

5. In the left sidebar, click **"Storage,"** then **"New bucket."** Name it exactly `food-photos`, and toggle it to **Public**. Click Create.

6. In the left sidebar, click **"Project Settings" → "API."** You'll see two things you need:
   - **Project URL**
   - **anon public key**

   Keep this tab open — you'll copy these into Vercel in Step C.

## Step B — Put the code on GitHub

1. Go to https://github.com and click **"New"** to create a repository. Name it `leftover-share`.
2. On the new repo page, click **"uploading an existing file."**
3. Drag in every file and folder from this project (keep the folder structure — `pages/`, `lib/`, `styles/` should stay as folders).
4. Click **"Commit changes."**

## Step C — Go live (Vercel)

1. Go to https://vercel.com, sign up with your GitHub account.
2. Click **"Add New Project,"** select your `leftover-share` repo, click **"Import."**
3. Before clicking Deploy, open **"Environment Variables"** and add two:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: (paste your Project URL from Step A)
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: (paste your anon public key from Step A)
4. Click **"Deploy."** Wait about a minute.
5. You'll get a working link like `leftover-share.vercel.app` — that's your live site.

## That's it

- Anyone who visits the link can post food or browse listings.
- Photos, posts, and "claimed" status are all saved for real now.
- When you're ready for a custom domain, buy one (Namecheap or Cloudflare are cheapest) and add it under your Vercel project's **"Domains"** tab — Vercel gives you the exact DNS records to enter at the registrar.

## If something breaks

The most common issue is a typo in the two environment variable values in Step C.3 — double check there's no extra space, and that you copied the *anon public* key, not the secret one.
