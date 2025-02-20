// src/features/account/controllers/update-language.ts
import { z } from 'zod';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

const updateLanguageSchema = z.object({
    language: z.string().min(2).max(2)
});

export async function updateUserLanguage(reqBody: unknown, userId: string): Promise<void> {
    const { language } = updateLanguageSchema.parse(reqBody);

    const supabase = await createSupabaseServerClient();

    // Verify the language exists in supported_languages
    const { data: languageExists } = await supabase
        .from('supported_languages')
        .select('locale')
        .eq('locale', language)
        .single();

    if (!languageExists) {
        throw new Error('Language not supported');
    }

    // Update user's preferred language
    const { error } = await supabase
        .from('users')
        .update({ preferred_language: language })
        .eq('id', userId);

    if (error) {
        console.error('Error updating language:', error);
    }
}