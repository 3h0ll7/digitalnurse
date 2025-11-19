-- Master user table
create table if not exists users (
  id uuid primary key,
  email text unique not null,
  password_hash text not null,
  full_name text not null,
  role text not null default 'nurse',
  organization text,
  units jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Clinical master data
create table if not exists master_data (
  id text primary key,
  type text not null,
  name text not null,
  category text,
  summary text,
  content jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create index if not exists master_data_type_idx on master_data (type);
