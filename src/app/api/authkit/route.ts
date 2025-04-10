import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/libs/supabase/supabase-server-client";
import { withAuth } from '@/utils/auth-check';
import { AuthKitToken } from "@picahq/authkit-node";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async (req: NextRequest) => {
    return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (req: NextRequest) => {
    try {
        const authKitToken = new AuthKitToken(process.env.PICA_SECRET_KEY as string);
        const supabase = await createSupabaseServerClient();

        // Get the authorization header
        const authHeader = req.headers.get('Authorization');
        let userId = "anonymous";

        // If there's an auth token, verify it and get the user ID
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            // Verify the token with Supabase
            const { data, error } = await supabase.auth.getUser(token);

            if (!error && data.user) {
                userId = data.user.id;
            }
        }

        const token = await authKitToken.create({
            identity: userId,
            identityType: "user"
        });

        return NextResponse.json(token, {
            headers: corsHeaders,
        });
    } catch (error) {
        console.error('AuthKit token creation error:', error)
        return new Response('Error creating AuthKit token', {
            status: 500,
            statusText: 'Internal Server Error',
            headers: corsHeaders,
        })
    }
}
