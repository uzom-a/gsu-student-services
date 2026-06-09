-- Auto-approve providers — they go live immediately on signup.
-- The is_approved column and admin queue stay in place so an admin can still
-- un-approve a problem provider later, but no new provider is gated on it.

alter table public.provider_profiles
  alter column is_approved set default true;

update public.provider_profiles
  set is_approved = true
  where is_approved = false;
