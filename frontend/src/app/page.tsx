import LoginForm from '@/components/LoginForm/LoginForm';

export default function Home() {
  return (
    <main className='flex justify-between max-w-screen-xl max-h-screen'>
      <section className=''>{/* image section on the left */}</section>
      <section className='flex align-middle'>
        <div className='flex flex-col align-middle justify-center'>
          <h1 className='p-4 pl-0 text-3xl text-center'>Login</h1>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
