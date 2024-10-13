-- PostgreSQL tutorial: https://supabase.com/docs/guides/database/tables#resources

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text unique not null,
  display_name text not null,
  biography text
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
declare username text;
begin
  select substring(new.email from '(.*)@') into username;
  insert into public.profiles (id, email, display_name, biography)
  values (new.id, new.email, username, null);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
