import { render, screen } from '@testing-library/react';
import { MainLayout } from '../MainLayout';

describe('MainLayout Component', () => {
  it('renders the title correctly', () => {
    render(<MainLayout title='My Page' isButtonVisible={false} children={<div>Child content</div>} />);
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<MainLayout title='My Page' isButtonVisible={false} children={<div>Child content</div>} />);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('does not render the button if isButtonVisible is false', () => {
    render(<MainLayout title='My Page' isButtonVisible={false} children={<div>Child content</div>} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the button if isButtonVisible is true', () => {
    render(<MainLayout title='My Page' isButtonVisible={true} children={<div>Child content</div>} buttonComponent={<button>Click Me</button>} />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders a custom button component if passed as prop', () => {
    render(
      <MainLayout title='My Page' isButtonVisible={true} children={<div>Child content</div>} buttonComponent={<button>Custom Button</button>} />
    );
    expect(screen.getByRole('button', { name: /custom button/i })).toBeInTheDocument();
  });
});
