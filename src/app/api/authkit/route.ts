import { NextRequest, NextResponse } from "next/server";

import { withAuth } from '@/utils/auth-check'
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

        const cookieStore = cookies();
        const userId = "anonymous";

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
