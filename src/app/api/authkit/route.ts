import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

import { withAuth } from '@/utils/auth-check'
import { AuthKitToken } from "@picahq/authkit-node";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export const OPTIONS = withAuth(async (req) => {
    return NextResponse.json({}, { headers: corsHeaders });
})

export const POST = withAuth(async (req) => {
    try {
        const authKitToken = new AuthKitToken(process.env.PICA_SECRET_KEY as string);

        const cookieStore = await cookies()
        const userId = cookieStore.get('userId')?.value

        const token = await authKitToken.create({
            identity: userId, // a meaningful identifier (i.e., userId, teamId or organizationId)
            identityType: "user" // can be either user, team or organization
        });

        // Add CORS headers to the response
        return NextResponse.json(token, {
            headers: corsHeaders,
        });
    } catch (error) {
        console.error('AuthKit token creation error:', error)
        return new Response('Error creating AuthKit token', {
            status: 500,
            statusText: 'Internal Server Error'
        })
    }
})