CREATE POLICY "Anonymous users cannot access profiles"
ON public.profiles FOR SELECT
TO anon
USING (false);