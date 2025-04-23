import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

const MOCK_USER_ID_SESSION = 'mock-dev-user-id'; // Renamed slightly to avoid potential conflicts if get-user also defines it

async function getMockSessionInternal() { // Renamed slightly to avoid potential export name conflicts
  console.log('[mock-auth internal] Providing mock session');
  return {
    access_token: 'mock-dev-access-token',
    token_type: 'bearer',
    refresh_token: 'mock-dev-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: {
      id: MOCK_USER_ID_SESSION,
      email: 'dev@example.com',
      role: 'authenticated',
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString()
    }
  };
}

export async function getSession() {
  // Conditionally return mock session in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[getSession] Using MOCK session (internal)');
    return getMockSessionInternal(); // Call the internal mock function
  }

  // Original logic for non-development environments
  console.log('[getSession] Using REAL session');
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
