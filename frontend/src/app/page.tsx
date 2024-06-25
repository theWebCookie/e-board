import LoginForm from '@/components/LoginForm/LoginForm';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center align-middle h-screen'>
      <section className='flex align-middle'>
        <div className='flex flex-col align-middle justify-center'>
          <h1 className='p-4 pl-0 text-3xl text-center'>Login</h1>
          <LoginForm />
        </div>
      </section>
      <Toaster />
    </main>
  );
}
