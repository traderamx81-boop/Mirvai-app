-- =========================================================================
-- MIRVAI REALTY & INVESTMENT - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Run this complete script in your Supabase Project -> SQL Editor -> New Query
-- =========================================================================

-- 1. PROPERTIES TABLE
create table if not exists public.properties (
  id text primary key,
  reference text not null,
  slug text not null unique,
  title text not null,
  location text not null,
  type text not null default 'Terrace duplex',
  category text not null default 'terrace-duplex',
  price bigint not null default 0,
  status text not null default 'Available',
  completion_status text default 'Fully completed',
  title_document text default 'Governor’s Consent',
  description text default '',
  image_url text default '',
  image_key text,
  verified integer default 1,
  featured boolean default false,
  features jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. WEBSITE SETTINGS TABLE
create table if not exists public.website_settings (
  id text primary key default 'current',
  hero_kicker_top text default 'Lagos · Nigeria · Diaspora',
  hero_kicker_bottom text default 'Buy · Sell · Invest',
  hero_headline_main text default 'Property decisions,',
  hero_headline_em text default 'made with confidence.',
  hero_copy text default 'We help you find, evaluate and secure the right property in Lagos—wherever you are in the world.',
  whatsapp text default '2349011081436',
  contact_email text default 'advisory@mirvaigroup.com',
  office_location text default 'Admiralty Way Corridor, Lekki Phase 1 / Ikeja, Lagos',
  play_store_url text default 'https://play.google.com/store/apps/details?id=com.mirvai.app',
  trust_points jsonb default '["Verified options", "Clear guidance", "End-to-end support"]'::jsonb,
  announcement text default '',
  show_announcement boolean default false,
  updated_at timestamptz default now()
);

-- 3. CHAT CONVERSATIONS TABLE
create table if not exists public.chat_conversations (
  id text primary key,
  visitor_token text not null,
  name text default 'Guest Visitor',
  contact text default 'Not provided',
  status text default 'active',
  unread_by_admin integer default 0,
  unread_by_visitor integer default 0,
  last_message text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. CHAT MESSAGES TABLE
create table if not exists public.chat_messages (
  id text primary key,
  conversation_id text not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'admin')),
  sender_name text,
  body text not null,
  time_string text,
  created_at timestamptz default now()
);

-- Create indexes for performance
create index if not exists idx_properties_category on public.properties (category);
create index if not exists idx_chat_conversations_token on public.chat_conversations (visitor_token);
create index if not exists idx_chat_messages_conv on public.chat_messages (conversation_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
alter table public.properties enable row level security;
alter table public.website_settings enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- Properties policies (Public read, admin write/manage)
drop policy if exists "Allow public select on properties" on public.properties;
create policy "Allow public select on properties" on public.properties for select using (true);

drop policy if exists "Allow all write on properties" on public.properties;
create policy "Allow all write on properties" on public.properties for all using (true) with check (true);

-- Website settings policies
drop policy if exists "Allow public select on website_settings" on public.website_settings;
create policy "Allow public select on website_settings" on public.website_settings for select using (true);

drop policy if exists "Allow all write on website_settings" on public.website_settings;
create policy "Allow all write on website_settings" on public.website_settings for all using (true) with check (true);

-- Chat conversations policies
drop policy if exists "Allow all on chat_conversations" on public.chat_conversations;
create policy "Allow all on chat_conversations" on public.chat_conversations for all using (true) with check (true);

-- Chat messages policies
drop policy if exists "Allow all on chat_messages" on public.chat_messages;
create policy "Allow all on chat_messages" on public.chat_messages for all using (true) with check (true);

-- =========================================================================
-- REALTIME SUBSCRIPTIONS
-- Enable realtime broadcasting so visitors and admins see updates instantly
-- =========================================================================
begin;
  -- Add tables to supabase_realtime publication
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.properties, 
    public.website_settings, 
    public.chat_conversations, 
    public.chat_messages;
commit;

-- =========================================================================
-- INITIAL SEED DATA
-- Populate default website settings and verified Lagos properties
-- =========================================================================
insert into public.website_settings (
  id, 
  hero_kicker_top, 
  hero_kicker_bottom, 
  hero_headline_main, 
  hero_headline_em, 
  hero_copy, 
  whatsapp, 
  contact_email, 
  office_location, 
  play_store_url, 
  trust_points, 
  announcement, 
  show_announcement
) values (
  'current',
  'Lagos · Nigeria · Diaspora',
  'Buy · Sell · Invest',
  'Property decisions,',
  'made with confidence.',
  'We help you find, evaluate and secure the right property in Lagos—wherever you are in the world.',
  '2349011081436',
  'advisory@mirvaigroup.com',
  'Admiralty Way Corridor, Lekki Phase 1 / Ikeja, Lagos',
  'https://play.google.com/store/apps/details?id=com.mirvai.app',
  '["Verified options", "Clear guidance", "End-to-end support"]'::jsonb,
  '',
  false
) on conflict (id) do nothing;

-- Seed Properties
insert into public.properties (
  id, reference, slug, title, location, type, category, price, status, completion_status, title_document, description, image_url, verified, featured, features
) values 
(
  'mirvai-ikeja-001',
  'MIR-IKE-001',
  'luxury-4-bedroom-terrace-duplex-adeniyi-jones',
  'Luxury 4-Bedroom Terrace Duplex with BQ',
  'Adeniyi Jones, Ikeja, Lagos',
  'Terrace duplex',
  'terrace-duplex',
  400000000,
  'Available',
  'Fully completed',
  'Governor’s Consent',
  'A fully completed four-bedroom luxury terrace duplex with boy''s quarters in Adeniyi Jones, Ikeja. Modern architecture with generous living spaces, an ante-room, all en-suite bedrooms, fitted marble kitchen and quality sanitary fittings. Gated environment in an established Ikeja neighbourhood.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
  1,
  true,
  '["Governor''s Consent Title", "Modern contemporary architecture", "Spacious living area with ante-room", "All rooms en-suite with walk-in wardrobes", "Fully fitted Italian marble kitchen", "Self-contained boy''s quarters (BQ)", "24/7 Security & CCTV surveillance"]'::jsonb
),
(
  'mirvai-lekki-002',
  'MIR-LEK-002',
  'contemporary-5-bedroom-fully-detached-lekki-1',
  'Contemporary 5-Bedroom Detached Villa with Pool',
  'Admiralty Way Corridor, Lekki Phase 1, Lagos',
  'Fully detached duplex',
  'fully-detached-duplex',
  650000000,
  'Available',
  'Ready for move-in',
  'Governor’s Consent',
  'Exceptional modern mansion featuring private infinity swimming pool, smart automated access control, elevator, double volume living room, and German fitted chef kitchen with Miele appliances.',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
  1,
  true,
  '["Verified Governor''s Consent", "Private swimming pool & cabana", "Cinema room & private elevator", "Smart home lighting & climate automation", "Industrial water treatment plant", "Dedicated 4-car garage"]'::jsonb
),
(
  'mirvai-ikoyi-003',
  'MIR-IKY-003',
  'waterfront-3-bedroom-luxury-penthouse-ikoyi',
  'Waterfront 3-Bedroom Penthouse with Panoramic Views',
  'Bouridllon / Waterfront, Ikoyi, Lagos',
  'Penthouse',
  'apartments-penthouses',
  850000000,
  'Under Offer',
  'Brand new',
  'Federal Certificate of Occupancy',
  'Ultra-prime waterfront penthouse boasting expansive 180-degree lagoon views, wraparound entertaining terraces, private boat jetty access, 24/7 uninterrupted power, and club amenities.',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
  1,
  true,
  '["Federal C of O with clean root of title", "Expansive lagoon waterfront terraces", "24-Hour uninterrupted turbine power", "Private boat slip & jetty access", "Olympics-size communal pool & gym", "High diaspora rental yield (12.5% USD)"]'::jsonb
),
(
  'mirvai-epe-004',
  'MIR-EPE-004',
  'prime-waterfront-commercial-residential-land-epe',
  '1,200 SQM Dry Waterfront Land (Commercial/Res)',
  'Alaro City Corridor, Epe Waterfront, Lagos',
  'Land',
  'land',
  95000000,
  'Available',
  'Ready for construction',
  'Gazette & Registered Survey',
  '100% dry table-land with direct access to dual carriageway. Free from government acquisition, registered survey lodged with surveyor-general, ideal for luxury residential subdivision or long-term capital appreciation.',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
  1,
  false,
  '["Registered Gazette & survey beacon validation", "100% dry table land (zero sand filling)", "Direct tarred access to Lekki-Epe expressway", "Rapidly appreciating high-growth corridor"]'::jsonb
)
on conflict (id) do nothing;
