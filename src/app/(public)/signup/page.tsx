import { redirect } from 'next/navigation';

import { getSession } from '@/features/account/controllers/get-session';

import { signInWithEmail, signInWithOAuth } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function SignUp() {
    const session = await getSession();

    if (session) {
        redirect('/chat');
    }

    return (
        <section className='py-24 m-auto flex h-full max-w-lg items-center'>
            <AuthUI mode='signup' signInWithOAuth={signInWithOAuth} signInWithEmail={signInWithEmail} />
        </section>
    );
} 