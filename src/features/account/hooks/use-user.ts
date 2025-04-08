import { useEffect, useState } from 'react';

import { getEnvVar } from '@/utils/get-env-var';
import { createBrowserClient } from '@supabase/ssr';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

// Initialize Supabase client outside the hook to avoid recreating it on every render
const supabase = createBrowserClient(
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
);

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const getSessionAndUser = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;
                setSession(session);
                setUser(session?.user ?? null);

                if (!session?.user) {
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    if (userError) throw userError;
                    setUser(user);
                }
            } catch (error) {
                console.error("Error fetching initial session/user:", error);
                setUser(null);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        getSessionAndUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return { user, session, loading };
} 