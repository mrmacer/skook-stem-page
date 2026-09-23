-- Schuylkill Living Lab — core schema
-- Run this in the Supabase SQL editor (or `supabase db push` if you adopt
-- the Supabase CLI later). Safe to re-run: every statement is idempotent.
--
-- Design notes:
--   * No student PII is ever collected. The scientific identity of a
--     record is School + Site + Grade Band + Observation, never a child.
--   * All public reads go through the anon key and RLS below restricts
--     them to already-moderated (status = 'approved') rows. All writes
--     go through server-side Vercel functions using the service-role
--     key (see api/submit-observation.js, api/submit-investigation.js),
--     which validate/sanitize input before insert -- the anon key has
--     NO insert/update/delete grants on any Living Lab table, so a
--     compromised or misused client can only ever read what's already
--     approved for public viewing.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- living_lab_schools
-- ---------------------------------------------------------------------
create table if not exists living_lab_schools (
  id uuid primary key default gen_random_uuid(),
  district_name text not null,
  school_name text not null,
  school_type text, -- e.g. elementary, middle, high, K-12
  latitude numeric(9,6),
  longitude numeric(9,6),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- living_lab_sites
-- One school can monitor multiple sites (schoolyard, stream, garden...).
-- ---------------------------------------------------------------------
create table if not exists living_lab_sites (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references living_lab_schools(id) on delete cascade,
  site_name text not null,
  habitat_type text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists living_lab_sites_school_id_idx on living_lab_sites(school_id);

-- ---------------------------------------------------------------------
-- living_lab_observations
-- ---------------------------------------------------------------------
create table if not exists living_lab_observations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references living_lab_schools(id) on delete cascade,
  site_id uuid references living_lab_sites(id) on delete set null,
  grade_band text not null check (grade_band in ('K-2','3-5','6-8','9-12','Mixed/Other')),
  observation_date date not null,
  category text not null check (category in
    ('Bird','Plant','Insect','Mammal','Amphibian/Reptile','Fungi','Aquatic Life','Other')),
  species_common_name text,
  species_scientific_name text,
  count integer check (count is null or count >= 0),
  habitat_type text,
  identification_tool text check (identification_tool is null or identification_tool in
    ('Merlin','Seek','eBird','iNaturalist','Field Guide','Expert Identification','Other')),
  notes text,
  student_question text,
  external_url text,
  image_url text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  -- Where this record originated -- Living Lab's own form today; room to
  -- import/sync approved eBird or iNaturalist datasets later without a
  -- schema change (see brief: "DATA IMPORT / EXTERNAL SYSTEMS").
  source text not null default 'living_lab' check (source in ('living_lab','ebird','inaturalist','import')),
  external_record_id text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists living_lab_observations_school_id_idx on living_lab_observations(school_id);
create index if not exists living_lab_observations_status_idx on living_lab_observations(status);
create index if not exists living_lab_observations_category_idx on living_lab_observations(category);
create index if not exists living_lab_observations_date_idx on living_lab_observations(observation_date);

-- ---------------------------------------------------------------------
-- living_lab_investigations
-- ---------------------------------------------------------------------
create table if not exists living_lab_investigations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references living_lab_schools(id) on delete cascade,
  grade_band text not null check (grade_band in ('K-2','3-5','6-8','9-12','Mixed/Other')),
  title text not null,
  driving_question text not null,
  description text,
  category text,
  status text not null default 'question' check (status in
    ('question','collecting_data','analyzing','taking_action','completed')),
  findings text,
  project_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists living_lab_investigations_school_id_idx on living_lab_investigations(school_id);
create index if not exists living_lab_investigations_status_idx on living_lab_investigations(status);

-- ---------------------------------------------------------------------
-- living_lab_investigation_schools
-- Junction table for future multi-school "Investigate This Too" support.
-- ---------------------------------------------------------------------
create table if not exists living_lab_investigation_schools (
  investigation_id uuid not null references living_lab_investigations(id) on delete cascade,
  school_id uuid not null references living_lab_schools(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (investigation_id, school_id)
);

-- =======================================================================
-- Row Level Security
-- =======================================================================
alter table living_lab_schools enable row level security;
alter table living_lab_sites enable row level security;
alter table living_lab_observations enable row level security;
alter table living_lab_investigations enable row level security;
alter table living_lab_investigation_schools enable row level security;

-- Public (anon key) read access -- schools/sites: active only.
drop policy if exists "public read active schools" on living_lab_schools;
create policy "public read active schools" on living_lab_schools
  for select using (active = true);

drop policy if exists "public read active sites" on living_lab_sites;
create policy "public read active sites" on living_lab_sites
  for select using (active = true);

-- Public (anon key) read access -- observations: approved only. This is
-- the one table where the moderation queue (status='pending') must never
-- leak to the public dashboard/map.
drop policy if exists "public read approved observations" on living_lab_observations;
create policy "public read approved observations" on living_lab_observations
  for select using (status = 'approved');

-- Investigations are lower-risk, teacher-authored content -- visible as
-- soon as created (no moderation queue in MVP; revisit if spam appears).
drop policy if exists "public read investigations" on living_lab_investigations;
create policy "public read investigations" on living_lab_investigations
  for select using (true);

drop policy if exists "public read investigation schools" on living_lab_investigation_schools;
create policy "public read investigation schools" on living_lab_investigation_schools
  for select using (true);

-- No insert/update/delete policies are defined for the anon role on any
-- table above -- by default that means anon has zero write access.
-- All writes happen through the Vercel serverless functions using the
-- service-role key, which bypasses RLS entirely (that's expected and
-- safe: the service-role key never reaches the browser, and every
-- function validates/sanitizes input before writing).
