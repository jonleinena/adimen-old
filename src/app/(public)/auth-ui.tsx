'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { IoLogoGoogle } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ActionResponse } from '@/types/action-response';

export function AuthUI({
  mode,
  signInWithOAuth,
  signInWithEmail,
}: {
  mode: 'login' | 'signup';
  signInWithOAuth: (provider: 'google') => Promise<ActionResponse>;
  signInWithEmail: (email: string) => Promise<ActionResponse>;
}) {
  const t = useTranslations('auth');
  const [pending, setPending] = useState(false);
  const [emailFormOpen, setEmailFormOpen] = useState(false);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = event.target as HTMLFormElement;
    const email = form['email'].value;
    const response = await signInWithEmail(email);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: t('email_error'),
      });
    } else {
      toast({
        description: t('email_success', { email }),
      });
    }

    form.reset();
    setPending(false);
  }

  async function handleOAuthClick(provider: 'google') {
    setPending(true);
    const response = await signInWithOAuth(provider);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: t('oauth_error'),
      });
      setPending(false);
    }
  }

  return (
    <section className='mt-16 flex w-full flex-col gap-8 rounded-lg p-10 px-4 text-center'>
      <div className='flex flex-col gap-4'>
        <Image src='/logo.png' width={80} height={80} alt='' className='m-auto' />
        <h1 className='text-3xl font-bold tracking-tighter'>{t(mode === 'login' ? 'login_title' : 'signup_title')}</h1>
        <p className='text-muted-foreground sm:text-lg max-w-md mx-auto'>
          {t(mode === 'login' ? 'login_description' : 'signup_description')}
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        <button
          className='flex items-center justify-center gap-2 rounded-md bg-primary py-4 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:bg-neutral-700'
          onClick={() => handleOAuthClick('google')}
          disabled={pending}
        >
          <IoLogoGoogle size={20} />
          {t('continue_with_google')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>

        <Collapsible open={emailFormOpen} onOpenChange={setEmailFormOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full py-6 font-medium"
              disabled={pending}
            >
              {t('continue_with_email')}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='mt-[-2px] w-full bg-white rounded-b-md p-8 border border-gray-200'>
              <form onSubmit={handleEmailSubmit}>
                <Input
                  type='email'
                  name='email'
                  placeholder={t('email_placeholder')}
                  aria-label={t('email_placeholder')}
                  autoFocus
                  className='border-gray-200 bg-gray-100'
                />
                <div className='mt-4 flex justify-end gap-2'>
                  <Button type='button' variant='outline' onClick={() => setEmailFormOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button variant='default' type='submit'>
                    {t('submit')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      {mode === 'signup' && (
        <span className='text-muted-foreground m-auto max-w-sm text-sm'>
          {t('terms_agreement')}{' '}
          <Link href='/terms' className='underline hover:text-primary'>
            {t('terms_of_service')}
          </Link>{' '}
          {t('and')}{' '}
          <Link href='/privacy' className='underline hover:text-primary'>
            {t('privacy_policy')}
          </Link>
          .
        </span>
      )}
    </section>
  );
}
