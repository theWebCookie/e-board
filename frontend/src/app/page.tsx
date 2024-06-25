import LoginForm from '@/components/LoginForm/LoginForm';
import RegisterForm from '@/components/RegisterForm/RegisterForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center align-middle h-screen'>
      <Dialog>
        <section className='flex align-middle'>
          <div className='flex flex-col align-middle justify-center'>
            <h1 className='p-4 pl-0 text-3xl text-center'>Login</h1>
            <LoginForm />
          </div>
        </section>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zarejestruj się</DialogTitle>
            <DialogDescription>Nie masz jeszcze konta. Wypełnij formularz i kontynuuj.</DialogDescription>
          </DialogHeader>
          <RegisterForm />
        </DialogContent>
      </Dialog>
      <Toaster />
    </main>
  );
}
