import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
    const t = await getTranslations('dashboard');

    return (
        <div className="container py-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">{t('welcome')}</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-medium text-lg mb-2">{t('statistics')}</h3>
                        <p className="text-muted-foreground">{t('statistics_description')}</p>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-medium text-lg mb-2">{t('recent_activity')}</h3>
                        <p className="text-muted-foreground">{t('activity_description')}</p>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-medium text-lg mb-2">{t('quick_actions')}</h3>
                        <p className="text-muted-foreground">{t('actions_description')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 