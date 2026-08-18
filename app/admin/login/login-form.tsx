'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm(){
  const router = useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setError(''); setLoading(true);
    const supabase=createClient();
    if(!supabase){setError('Supabase is not configured yet. Add the environment variables first.');setLoading(false);return;}
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    router.replace('/admin'); router.refresh();
  }

  return <form onSubmit={submit}>
    <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
    {error&&<div className="error-text">{error}</div>}
    <button disabled={loading}>{loading?'Signing in…':'Enter studio'}</button>
  </form>
}
