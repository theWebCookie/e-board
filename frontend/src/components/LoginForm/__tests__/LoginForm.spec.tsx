import LoginForm from '../LoginForm';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dialog } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const fillForm = async (email: string, password: string) => {
  fireEvent.change(screen.getByPlaceholderText('Wprowadź email'), {
    target: { value: email },
  });

  fireEvent.change(screen.getByPlaceholderText('Wprowadź hasło'), {
    target: { value: password },
  });

  const loginButton = screen.getByText('Zaloguj');
  loginButton.click();
};

describe('LoginForm', () => {
  it('should render login form', () => {
    render(
      <Dialog>
        <LoginForm />
      </Dialog>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Hasło')).toBeInTheDocument();
    expect(screen.getByText('Zaloguj')).toBeInTheDocument();
  });

  it('should render register button', () => {
    render(
      <Dialog>
        <LoginForm />
      </Dialog>
    );
    expect(screen.getByText('Rejestracja')).toBeInTheDocument();
  });

  it('should show error messages when submited form is empty', async () => {
    render(
      <Dialog>
        <LoginForm />
      </Dialog>
    );
    const loginButton = screen.getByText('Zaloguj');
    loginButton.click();
    expect(await screen.findByText('Email jest wymagany.')).toBeInTheDocument();
    expect(await screen.findByText('Hasło jest wymagane.')).toBeInTheDocument();
  });

  it('should show error message when submited form is invalid', async () => {
    render(
      <>
        <Dialog>
          <LoginForm />
        </Dialog>
        <Toaster />
      </>
    );

    await fillForm('invalid-email', '12345');
    expect(await screen.findByText('Niepoprawny adres email.')).toBeInTheDocument();
    expect(await screen.findByText('Hasło musi mieć co najmniej 6 znaków.')).toBeInTheDocument();
  });

  it('should show error toast after failed login', async () => {
    render(
      <>
        <Dialog>
          <LoginForm />
        </Dialog>
        <Toaster />
      </>
    );

    await fillForm('example@com.pl', '1234567');
    expect(await screen.findByText('Bład logowania ☹️')).toBeInTheDocument();
    expect(await screen.findByText('Niepoprawne dane logowania')).toBeInTheDocument();
  });

  it('should show toast after successful login', async () => {
    const mockEmail = 'example@com.pl';
    render(
      <>
        <Dialog>
          <LoginForm />
        </Dialog>
        <Toaster />
      </>
    );

    await fillForm(mockEmail, '123456');
    expect(await screen.findByText('Zalogowano pomyślnie 😊')).toBeInTheDocument();
    expect(await screen.findByText(`Witaj ${mockEmail}`)).toBeInTheDocument();
  });
});
