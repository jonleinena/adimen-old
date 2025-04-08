'use client';

import { Button } from "@/components/ui/button";
import { supabase } from "@/libs/supabase/supabase-client";
import { getURL } from "@/utils/get-url";
import { useAuthKit } from "@picahq/authkit";

export function AuthKitButton() {

    const { data: { session }, error: sessionError } = supabase.auth.getSession();
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
        <Button onClick={open}>
            Connect Tools
        </Button>
    );
}