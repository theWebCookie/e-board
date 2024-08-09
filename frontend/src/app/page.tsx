import LoginSection from '@/components/LoginForm/LoginSections';
import RegisterForm from '@/components/RegisterForm/RegisterForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';

export default function Login() {
  return (
    <main className='flex flex-col items-center justify-center align-middle h-screen'>
      <Dialog>
        <LoginSection />
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
