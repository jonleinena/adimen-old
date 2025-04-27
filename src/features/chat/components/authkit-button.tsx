'use client';

import { useEffect, useState } from 'react';
import { Plug } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        asChild
                        onClick={open}
                        disabled={!session || !!sessionError}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-muted"
                    >
                        <Plug className="h-4 w-4 px-2 py-2" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-black/70 text-white text-xs rounded px-2 py-1">
                    Connect your tools
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}