import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from '@/utils/auth-check'
import { AuthKitToken } from "@picahq/authkit-node";
import { Session } from '@supabase/supabase-js';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = withAuth(async (req, session) => {
    return NextResponse.json({}, { headers: corsHeaders });
})

export const POST = withAuth(async (req: NextRequest, session: Session) => {
    try {
        const authKitToken = new AuthKitToken(process.env.PICA_SECRET_KEY as string);

        if (!session?.user?.id) {
            console.error('AuthKit token creation error: User ID not found in session');
            return new Response('Error creating AuthKit token: Unauthorized', {
                status: 401,
                statusText: 'Unauthorized',
                headers: corsHeaders,
            });
        }

        const userId = session.user.id;

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
})