import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

// --- Start: Code moved from mock-auth.ts ---
const MOCK_USER_ID_USER = 'mock-dev-user-id'; // Renamed slightly

async function getMockUserInternal() { // Renamed slightly
  console.log('[mock-auth internal] Providing mock user');
  return {
    id: MOCK_USER_ID_USER,
    email: 'dev@example.com',
    preferred_language: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    full_name: 'Mock Dev User',
    avatar_url: null,
    billing_address: null,
    payment_method: null
  };
}
// --- End: Code moved from mock-auth.ts ---

export async function getUser() {
  // Conditionally return mock user in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[getUser] Using MOCK user (internal)');
    return getMockUserInternal(); // Call the internal mock function
  }

  // Original logic for non-development environments
  console.log('[getUser] Using REAL user');
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('users').select('*').single();

  if (error) {
    console.error(error);
    // Decide what to return on error. Null might be appropriate if the caller expects it.
    return null;
  }

  return data;
}
