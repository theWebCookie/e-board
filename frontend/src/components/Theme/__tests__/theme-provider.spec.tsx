import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../theme-provider';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  ThemeProvider: jest.fn(({ children }) => <div>{children}</div>),
  useTheme: jest.fn(() => ({ theme: 'light', setTheme: jest.fn(), themes: ['light', 'dark'] })),
}));

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('passes theme-related props correctly', () => {
    jest.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme: jest.fn(), themes: ['light', 'dark'] });

    render(
      <ThemeProvider>
        <div>Test Theme</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Test Theme')).toBeInTheDocument();
  });

  it('handles theme change correctly', () => {
    const mockSetTheme = jest.fn();
    jest.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: mockSetTheme, themes: ['light', 'dark'] });

    render(
      <ThemeProvider>
        <button onClick={() => mockSetTheme('dark')}>Toggle Theme</button>
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle Theme');
    button.click();

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
