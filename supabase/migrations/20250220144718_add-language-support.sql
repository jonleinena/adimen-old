-- Create supported_languages table
create table supported_languages (
  locale text primary key,
  name text not null,
  native_name text not null,
  enabled boolean default true
);

-- Insert the currently supported languages
insert into supported_languages (locale, name, native_name) values
  ('en', 'English', 'English'),
  ('es', 'Spanish', 'Español'),
  ('eu', 'Basque', 'Euskara');

-- Add preferred_language column to users table
alter table users add column preferred_language text references supported_languages(locale) default 'en';

-- Add RLS policies for supported_languages
alter table supported_languages enable row level security;
create policy "Allow public read access to supported_languages" on supported_languages
  for select using (true);
