

# Fix AI Assistant to Return Real AI Responses

## Problem
The edge function `ai-chat` requires user authentication (`getUser()`), but the app has no login/signup system. The frontend sends only the anon key, which fails authentication, so users always get an error — never real AI responses.

## Solution
Remove the user-authentication requirement from the edge function and switch to IP-based or anonymous rate limiting instead. This lets the AI work immediately without requiring users to sign up.

## Changes

### 1. Update Edge Function (`supabase/functions/ai-chat/index.ts`)
- Remove the `getUser()` authentication check
- Use a fingerprint/IP-based identifier for rate limiting instead of `user_id`
- Extract client IP from request headers for rate limiting
- Keep all existing functionality: streaming, rate limiting, system prompts, mode support
- Update model to `google/gemini-3-flash-preview` (latest recommended default)

### 2. Update Frontend (`src/pages/AIAssistant.tsx`)
- Send the `apikey` header (anon key) instead of `Authorization: Bearer` to match edge function expectations
- No other UI changes needed — all existing features stay intact

### 3. Deploy Edge Function
- Deploy the updated `ai-chat` function

## Technical Details
- Rate limiting will use client IP hash from `x-forwarded-for` or `x-real-ip` headers
- The `ai_rate_limits` table already exists and will continue to be used with IP-based identifiers
- The Lovable AI Gateway key (`LOVABLE_API_KEY`) is already configured as a secret
- No new tables or migrations needed

