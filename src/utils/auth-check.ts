import { NextResponse } from 'next/server';

import { getSession } from '@/features/account/controllers/get-session';

/**
 * Higher-order function to protect API routes with authentication
 * Creates a clean wrapper around API handlers that ensures user is authenticated
 */
export function withAuth<T extends Request>(handler: (req: T, session: any) => Promise<Response>) {
    return async (req: T) => {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Pass both request and session to handler for convenience
        return handler(req, session);
    };
} 