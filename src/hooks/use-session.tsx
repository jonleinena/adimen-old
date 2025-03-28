'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

// Contador global para registrar llamadas del lado cliente
let clientSessionCallCounter = 0;

export function useSession() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Incrementar contador y registrar en el log
    clientSessionCallCounter++;
    console.log(`[CLIENT_SESSION_TRACKER] useSession efecto ejecutado #${clientSessionCallCounter}`);
    
    async function getSession() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }
        
        setSession(data.session)
      } catch (error) {
        console.error('Error in useSession hook:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getSession()
  }, [])

  return { session, loading }
} 