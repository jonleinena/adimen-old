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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null);
                setLoading(false); // Update loading state on auth change too
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return { user, loading };
} 