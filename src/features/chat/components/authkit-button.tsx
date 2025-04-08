'use client';

import { Button } from "@/components/ui/button";
import { useUser } from "@/features/account/hooks/use-user";
import { getURL } from "@/utils/get-url";
import { useAuthKit } from "@picahq/authkit";

export function AuthKitButton() {
    const { user, session, loading } = useUser();

    const accessToken = session?.access_token ?? '';
    const userId = user?.id ?? '';

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

    if (loading) {
        return <Button disabled>Loading...</Button>;
    }

    if (!accessToken || !userId) {
        return <Button disabled>Connect Tools (Auth Unavailable)</Button>;
    }

    return (
        <Button onClick={open}>
            Connect Tools
        </Button>
    );
}