-- =============================================================
-- Stats refresh — run this in the Supabase SQL Editor
--
-- Replaces the PDAO-seeded stat strip with numbers led by the NAM Builders
-- internship system (the one handling ₱1M+/month in production).
-- You can tweak wording anytime in Admin → Stats.
-- =============================================================

begin;

delete from stats;

insert into stats (value, label, sort_order) values
  ('₱1M+', 'monthly sales running through my system', 1),
  ('5', 'projects shipped', 2),
  ('2,000+', 'government records digitized', 3),
  ('4', 'Google & Cisco certifications', 4);

commit;
