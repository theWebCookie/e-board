import LoginForm from '../LoginForm';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dialog } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { schemaErrorDictionary } from '@config';

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

const mockUserData = {
  name: 'example_test',
  email: 'example_test@com.pl',
  password: '123456',
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

    await fillForm('invalid-email', mockUserData.password.slice(0, 5));
    expect(await screen.findByText(schemaErrorDictionary['email-is-invalid'])).toBeInTheDocument();
    expect(await screen.findByText(schemaErrorDictionary['password-is-weak'])).toBeInTheDocument();
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

    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ error: 'Niepoprawne hasło.' }),
          ok: false,
        }) as Promise<Response>
    );

    await fillForm(mockUserData.email, mockUserData.password + 'invalid');
    expect(await screen.findByText('Niepoprawne hasło.')).toBeInTheDocument();
  });

  it('should show toast after successful login', async () => {
    render(
      <>
        <Dialog>
          <LoginForm />
        </Dialog>
        <Toaster />
      </>
    );

    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ name: mockUserData.name }),
          ok: true,
        }) as Promise<Response>
    );

    await fillForm(mockUserData.email, mockUserData.password);
    expect(await screen.findByText('Zalogowano pomyślnie 😊')).toBeInTheDocument();
    expect(await screen.findByText(`Witaj ${mockUserData.name}!`)).toBeInTheDocument();
  });
});
