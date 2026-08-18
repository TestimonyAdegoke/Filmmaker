import Link from 'next/link';
import LoginForm from './login-form';

export default function AdminLogin(){
  return <main className="login-page"><div className="login-card">
    <p className="eyebrow">Private content studio</p><h1>Sign in.</h1>
    <LoginForm/>
    <p className="login-note">Only users listed in the <code>admins</code> table can manage portfolio content. <Link href="/">Return to portfolio ↗</Link></p>
  </div></main>
}
