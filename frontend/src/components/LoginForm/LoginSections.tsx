import LoginForm from './LoginForm';

const LoginSection = () => {
  return (
    <section className='flex align-middle'>
      <div className='flex flex-col align-middle justify-center'>
        <h1 className='p-4 pl-0 text-3xl text-center'>Login</h1>
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginSection;
