-- Schema untuk portfolio
-- Jalankan di SQL Editor Supabase

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  bio text,
  location text,
  avatar_url text,
  resume_url text,
  email text,
  linkedin_url text,
  github_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  description text,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tags text[] default '{}',
  image_url text,
  live_url text,
  github_url text,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pastikan row-level security tidak mengganggu read di public site
alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;

create policy if not exists "Allow public read access to profiles"
  on public.profiles for select
  using (true);

create policy if not exists "Allow public read access to experiences"
  on public.experiences for select
  using (true);

create policy if not exists "Allow public read access to projects"
  on public.projects for select
  using (true);

-- Data demo / default untuk portfolio
insert into public.profiles (
  full_name,
  title,
  bio,
  location,
  email,
  linkedin_url,
  github_url
)
values (
  'Daniel Tulus Parsaoran Simamora',
  'Web Developer & Tech Enthusiast',
  'Saya adalah pengembang web yang berdedikasi membangun solusi digital inovatif dengan performa optimal dan tampilan premium. Fokus saya saat ini adalah Next.js, React, dan integrasi basis data modern.',
  'Indonesia',
  'daniel.simamora@example.com',
  'https://www.linkedin.com/in/daniel-tulus-parsaoran-simamora-208783213/',
  'https://github.com'
)
on conflict do nothing;

insert into public.experiences (
  company,
  role,
  location,
  start_date,
  end_date,
  is_current,
  description,
  display_order
)
values
  (
    'Proyek Independen (Freelance)',
    'Junior Web Developer',
    'Remote',
    '2024-01-01',
    null,
    true,
    'Mendesain dan memprogram aplikasi web interaktif menggunakan ekosistem React/Next.js dan basis data PostgreSQL. Berkolaborasi langsung dengan klien untuk menerjemahkan kebutuhan bisnis menjadi interface siap pakai.',
    1
  ),
  (
    'Universitas / Pelatihan Mandiri',
    'Student of Software Engineering & Web Development',
    'Indonesia',
    '2022-09-01',
    '2023-12-31',
    false,
    'Mempelajari dasar rekayasa perangkat lunak, algoritma, pemodelan database relational, serta teknologi frontend modern seperti Tailwind CSS, JavaScript, dan integrasi API.',
    2
  )
on conflict do nothing;

insert into public.projects (
  title,
  description,
  tags,
  image_url,
  live_url,
  github_url,
  display_order
)
values
  (
    'E-Commerce App (Proyek Portofolio)',
    'Aplikasi toko online modern dengan sistem manajemen produk, keranjang belanja, proses pembayaran simulasi, dan integrasi Supabase Database.',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    null,
    '#',
    '#',
    1
  ),
  (
    'Sistem Manajemen Tugas Real-time',
    'Aplikasi produktivitas berbasis Kanban Board dengan fungsionalitas kolaborasi instan, drag-and-drop antarmuka, dan sinkronisasi real-time.',
    ARRAY['React.js', 'Node.js', 'Express', 'WebSockets'],
    null,
    '#',
    '#',
    2
  )
on conflict do nothing;
