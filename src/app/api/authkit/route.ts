import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/libs/supabase/supabase-server-client";
import { withAuth } from '@/utils/auth-check';
import { AuthKitToken } from "@picahq/authkit-node";

export const maxDuration = 60;

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
        if (!authHeader) {
            return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
        }
        let userId = "anonymous";

        // If there's an auth token, verify it and get the user ID
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            // Verify the token with Supabase
            const { data, error } = await supabase.auth.getUser(token);

            if (error) {
                throw new Error(error.message);
            }

            if (!data.user) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }


            userId = data.user.id;
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
