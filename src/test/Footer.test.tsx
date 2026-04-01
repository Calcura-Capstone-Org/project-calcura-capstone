import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from '../components/Footer';

describe('Footer', () => {
  const defaultProps = {
    onAboutClick: vi.fn(),
    onContactClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders footer section headings', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });

  it('renders copyright notice', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText('© 2025 Calcura. All rights reserved.')).toBeInTheDocument();
  });

  it('calls onAboutClick when About is clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByText('About'));
    expect(defaultProps.onAboutClick).toHaveBeenCalled();
  });

  it('calls onContactClick when Contact Us is clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByText('Contact Us'));
    expect(defaultProps.onContactClick).toHaveBeenCalled();
  });

  it('renders product links', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Updates')).toBeInTheDocument();
  });

  it('renders support links', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });
});
