# Enable FishDex AI fish verification

The frontend and server function are committed, but **photo verification is not active until deployed**.

1. Open the Supabase project `creyqlmyvmaqsurbccgf` and run `supabase/migrations/20261031004500_verified_fish_unlocks.sql` in SQL Editor (or apply migrations using the CLI).
2. Create an OpenAI API key with billing enabled. Set it **only as a Supabase Edge Function secret** named `OPENAI_API_KEY`. Never add it to GitHub, browser code, or Supabase publishable settings.
3. Deploy from the repository root using Supabase CLI:
   ```sh
   supabase login
   supabase link --project-ref creyqlmyvmaqsurbccgf
   supabase secrets set OPENAI_API_KEY=YOUR_PRIVATE_KEY
   supabase functions deploy verify-fish
   ```
4. Test with a signed-in account and a clear original photo. The function needs `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` available in its Edge Function environment (Supabase normally injects these for hosted functions; verify if your project uses newer key conventions).
5. Confirm a successful match appears in `verified_fish_unlocks` and that other users cannot read or write the row.

Security limitations: a confidence score is the model's estimate, not a calibrated probability; AI may misidentify fish, and it cannot prove the person submitting a photo caught it. Exact SHA-256 matching only prevents byte-for-byte reuse; edited or recropped photos can evade it. Stronger anti-cheating needs perceptual matching, capture challenges, moderation, and rate limiting. Do not use this as the sole control for prizes or money.

Legacy local catches are retained for personal logging but do not grant verified unlocks. Fish photos are sent to the AI service for analysis and are not stored in the new unlock table; the table stores only the photo hash, species, user ID, and verification time.
