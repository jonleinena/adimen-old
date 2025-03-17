import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSession } from '@/features/account/controllers/get-session';
import { getUser } from '@/features/account/controllers/get-user';

export default async function SettingsPage() {
    const t = await getTranslations('settings');
    const user = await getUser();
    const session = await getSession();

    return (
        <div className="container py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="account">{t('account')}</TabsTrigger>
                        <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
                        <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
                        <TabsTrigger value="billing">{t('billing')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">{t('account_settings')}</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        disabled
                                        defaultValue={session?.user?.email || ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">{t('language')}</Label>
                                    <select
                                        id="language"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        defaultValue={user?.preferred_language || 'en'}
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="eu">Euskara</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button>{t('save_changes')}</Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="profile">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">{t('profile_settings')}</h2>
                            <p className="text-muted-foreground">{t('profile_description')}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">{t('notification_settings')}</h2>
                            <p className="text-muted-foreground">{t('notifications_description')}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="billing">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">{t('billing_settings')}</h2>
                            <p className="text-muted-foreground">{t('billing_description')}</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 