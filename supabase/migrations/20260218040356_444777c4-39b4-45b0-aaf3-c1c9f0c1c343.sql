
-- Fix: restrict rate limits table to service role only by dropping the permissive policy
-- and replacing it with a deny-all user policy (edge functions use service role key which bypasses RLS)
DROP POLICY IF EXISTS "Service role manages rate limits" ON public.ai_rate_limits;

-- No user-level policies needed — edge functions access this table via service role key
-- which bypasses RLS entirely. Block all direct user access.
CREATE POLICY "No direct user access to rate limits"
  ON public.ai_rate_limits
  FOR ALL
  USING (false);
