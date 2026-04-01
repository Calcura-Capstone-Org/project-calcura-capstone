import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';

describe('Header', () => {
  const defaultProps = {
    onLoginClick: vi.fn(),
    onHomeClick: vi.fn(),
    onAccountClick: vi.fn(),
    onDashboardClick: vi.fn(),
    onAboutClick: vi.fn(),
    onContactClick: vi.fn(),
    onTemplatesClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Calcura brand name', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Calcura')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
  });

  it('shows Login and Sign Up buttons when logged out', () => {
    render(<Header {...defaultProps} isLoggedIn={false} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up Free')).toBeInTheDocument();
  });

  it('shows Account button when logged in', () => {
    render(<Header {...defaultProps} isLoggedIn={true} />);
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('shows Dashboard link when logged in', () => {
    render(<Header {...defaultProps} isLoggedIn={true} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('does not show Dashboard link when logged out', () => {
    render(<Header {...defaultProps} isLoggedIn={false} />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('calls onHomeClick when logo is clicked', () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText('Calcura'));
    expect(defaultProps.onHomeClick).toHaveBeenCalled();
  });

  it('calls onAboutClick when About is clicked', () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText('About'));
    expect(defaultProps.onAboutClick).toHaveBeenCalled();
  });

  it('calls onContactClick when Contact is clicked', () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText('Contact'));
    expect(defaultProps.onContactClick).toHaveBeenCalled();
  });
});
