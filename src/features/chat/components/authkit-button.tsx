'use client';

import { useEffect, useState } from 'react';
import { Plug } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { supabase } from "@/libs/supabase/supabase-client";
import { getURL } from "@/utils/get-url";
import { useAuthKit } from "@picahq/authkit";
import { AuthError, Session } from '@supabase/supabase-js';

export function AuthKitButton() {
    const [session, setSession] = useState<Session | null>(null);
    const [sessionError, setSessionError] = useState<AuthError | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            setSession(data.session);
            setSessionError(error);
        };
        fetchSession();
    }, []);

    const accessToken = session?.access_token ?? '';
    const userId = session?.user?.id ?? '';

    const { open } = useAuthKit({
        token: {
            url: getURL("api/authkit"),
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
        },
        onSuccess: (connection) => { console.log("AuthKit Success:", connection); },
        onError: (error) => { console.error("AuthKit Error:", error); },
        onClose: () => { console.log("AuthKit Closed"); },
    });


    return (
        <Button
            onClick={open}
            disabled={!session || !!sessionError}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-muted"
        >
            <Plug className="h-4 w-4" />
            <span className="sr-only">Connect</span>
        </Button>
    );
}