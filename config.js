// Forms
export const passwordLength = 6;
export const inviteCodeLength = 8; // also in backend/src/config.js

export const genericDictionary = {
  'generic-error': 'Coś poszło nie tak. Spróbuj ponownie później.',
};

export const errorDictionary = {
  'invalid-data': 'Błędne dane!',
  'email-already-in-use': 'Email jest już zajęty!',
  'invalid-email': 'Błędny email!',
  'weak-password': `Hasło musi mieć co najmniej ${passwordLength} znaków!`,
};

export const schemaErrorDictionary = {
  'email-is-required': 'Email jest wymagany.',
  'email-is-invalid': 'Niepoprawny adres email.',
  'password-is-required': 'Hasło jest wymagane.',
  'password-is-weak': `Hasło musi mieć co najmniej ${passwordLength} znaków.`,
  'name-is-required': 'Imię jest wymagane.',
};

export const createBoardSchemaErrorDictionary = {
  'board-name-is-required': 'Nazwa jest wymagana.',
};

export const boardRouteDictionary = {
  'board-url-fail': 'Nie udalo się pobrać url tablicy.',
  'board-create-success': 'Utworzono tablicę.',
};

export const inviteFormDictionary = {
  'invite-code-is-required': 'Kod jest wymagany.',
  'invite-code-is-invalid': 'Niepoprawny kod.',
  'success-invite': 'Dołączono pomyślnie.',
  'user-id-is-required': 'Id użytkownika jest wymagane.',
};

export const toastTimeout = 3000;
export const loginToastDictionary = {
  'success-login-toast-title': 'Zalogowano pomyślnie 😊',
  'fail-login-toast-title': 'Błąd logowania ☹️',
  'success-register-toast-title': 'Zarejestrowano pomyślnie 😊',
};

export const registerToastDictionary = {
  'success-register-toast-title': 'Zarejestrowano pomyślnie 😊',
  'fail-register-toast-title': 'Błąd podczas rejestracji ☹️',
};

export const boardToastDictionary = {
  'success-board-toast-title': 'Utworzono tablicę pomyślnie 😊',
  'fail-board-toast-title': 'Błąd podczas tworzenia tablicy ☹️',
  'success-invite-toast-title': 'Dołączono pomyślnie 😊',
  'fail-invite-toast-title': 'Błąd podczas dołączania ☹️',
};

export const tokenDictionary = {
  'token-is-required': 'Token jest wymagany.',
  'token-is-invalid': 'Niepoprawny token.',
  'token-is-expired': 'Token wygasł.',
};

export const notificationDictionary = {
  'success-notification-delete': 'Usunięto powiadomienie.',
};

// Tools
export const arrowHeadLength = 10;
export const bowingOptionValue = 2;
export const defaultOptions = {
  roughness: '1.2',
  seed: '0',
  fill: 'transparent',
  stroke: '#000000',
  strokeWidth: '2',
  strokeLineDash: '',
  opacity: '1',
  fontSize: '12',
};
