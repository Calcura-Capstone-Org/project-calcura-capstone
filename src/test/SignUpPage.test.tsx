import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpPage } from '../components/SignUpPage';

describe('SignUpPage', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onCreateAccount: vi.fn(),
    onContinueAsGuest: vi.fn(),
    onHomeClick: vi.fn(),
    onLoginSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sign up form', () => {
    render(<SignUpPage {...defaultProps} />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('renders the Sign Up submit button', () => {
    render(<SignUpPage {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    render(<SignUpPage {...defaultProps} />);
    expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
  });

  it('renders continue as guest option', () => {
    render(<SignUpPage {...defaultProps} />);
    expect(screen.getByText('Continue as a Guest')).toBeInTheDocument();
  });

  it('calls onContinueAsGuest when guest link is clicked', () => {
    render(<SignUpPage {...defaultProps} />);
    fireEvent.click(screen.getByText('Continue as a Guest'));
    expect(defaultProps.onContinueAsGuest).toHaveBeenCalled();
  });

  it('allows typing in all form fields', () => {
    render(<SignUpPage {...defaultProps} />);
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123' } });
    fireEvent.change(confirmInput, { target: { value: 'pass123' } });

    expect(emailInput).toHaveValue('new@example.com');
    expect(passwordInput).toHaveValue('pass123');
    expect(confirmInput).toHaveValue('pass123');
  });
});
