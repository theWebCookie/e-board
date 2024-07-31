import { fireEvent, render, screen } from '@testing-library/react';
import { Toaster } from '@/components/ui/toaster';
import RegisterForm from '../RegisterForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const fillForm = async (name: string, email: string, password: string) => {
  fireEvent.change(screen.getByPlaceholderText('Wprowadź imię'), {
    target: { value: name },
  });

  fireEvent.change(screen.getByPlaceholderText('Wprowadź email'), {
    target: { value: email },
  });

  fireEvent.change(screen.getByPlaceholderText('Wprowadź hasło'), {
    target: { value: password },
  });

  const registerButton = screen.getByText('Zarejestruj');
  registerButton.click();
};

describe('RegisterForm', () => {
  it('should render register form', () => {
    render(
      <>
        <RegisterForm />
      </>
    );
    expect(screen.getByText('Imię')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Hasło')).toBeInTheDocument();
  });

  it('should show error messages when submited form is empty', async () => {
    render(
      <>
        <RegisterForm />
      </>
    );
    const registerButton = screen.getByText('Zarejestruj');
    registerButton.click();
    expect(await screen.findByText('Imię jest wymagane.')).toBeInTheDocument();
    expect(await screen.findByText('Email jest wymagany.')).toBeInTheDocument();
    expect(await screen.findByText('Hasło jest wymagane.')).toBeInTheDocument();
  });

  it('should show error message when submited form is invalid', async () => {
    render(
      <>
        <RegisterForm />
      </>
    );

    await fillForm('example', 'invalid-email', '12345');
    expect(await screen.findByText('Niepoprawny adres email.')).toBeInTheDocument();
    expect(await screen.findByText('Hasło musi mieć co najmniej 6 znaków.')).toBeInTheDocument();
  });

  it('should show error messages after entering invalid register data', async () => {
    render(
      <>
        <RegisterForm />
      </>
    );

    await fillForm('example', 'example.pl', '12345');
    expect(await screen.findByText('Niepoprawny adres email.')).toBeInTheDocument();
    expect(await screen.findByText('Hasło musi mieć co najmniej 6 znaków.')).toBeInTheDocument();
  });

  it('should show toast after successful register', async () => {
    const mockEmail = 'example@com.pl';
    render(
      <>
        <RegisterForm />
        <Toaster />
      </>
    );

    await fillForm('example', mockEmail, '123456');
    expect(await screen.findByText('Zarejestrowano pomyślnie 😊')).toBeInTheDocument();
    expect(await screen.findByText(`Witaj ${mockEmail}`)).toBeInTheDocument();
  });
});
