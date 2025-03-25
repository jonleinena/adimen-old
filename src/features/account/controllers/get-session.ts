import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function getSession() {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    return null;
  }

  if (!user) {
    return null;
  }

  // Get the session after verifying the user
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(sessionError);
    return null;
  }

  return session;
}
