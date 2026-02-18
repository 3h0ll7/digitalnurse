
-- Rate limiting table for AI chat requests
CREATE TABLE public.ai_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL,  -- IP address or user ID
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  request_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_identifier, request_date)
);

-- Enable RLS
ALTER TABLE public.ai_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow the service role to manage rate limits (edge functions use service role)
CREATE POLICY "Service role manages rate limits"
  ON public.ai_rate_limits
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_ai_rate_limits_identifier_date 
  ON public.ai_rate_limits (user_identifier, request_date);
