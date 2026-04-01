import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPage } from '../components/LoginPage';

describe('LoginPage', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onCreateAccount: vi.fn(),
    onContinueAsGuest: vi.fn(),
    onHomeClick: vi.fn(),
    onLoginSuccess: vi.fn(),
    onForgotPassword: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginPage {...defaultProps} />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<LoginPage {...defaultProps} />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  it('renders create account and guest options', () => {
    render(<LoginPage {...defaultProps} />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Continue as a Guest')).toBeInTheDocument();
  });

  it('calls onForgotPassword when forgot password is clicked', () => {
    render(<LoginPage {...defaultProps} />);
    fireEvent.click(screen.getByText('Forgot Password'));
    expect(defaultProps.onForgotPassword).toHaveBeenCalled();
  });

  it('calls onCreateAccount when create account is clicked', () => {
    render(<LoginPage {...defaultProps} />);
    fireEvent.click(screen.getByText('Create Account'));
    expect(defaultProps.onCreateAccount).toHaveBeenCalled();
  });

  it('calls onContinueAsGuest when guest option is clicked', () => {
    render(<LoginPage {...defaultProps} />);
    fireEvent.click(screen.getByText('Continue as a Guest'));
    expect(defaultProps.onContinueAsGuest).toHaveBeenCalled();
  });

  it('allows typing in email and password fields', () => {
    render(<LoginPage {...defaultProps} />);
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });

    expect(emailInput).toHaveValue('test@gmail.com');
    expect(passwordInput).toHaveValue('test');
  });
});
