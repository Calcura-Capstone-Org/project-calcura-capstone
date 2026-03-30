import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the landing page by default', () => {
    render(<App />);
    expect(screen.getByText('Unlock Your Financial Health')).toBeInTheDocument();
  });

  it('navigates to login page when Login button is clicked', () => {
    render(<App />);
    const loginButtons = screen.getAllByText('Login');
    fireEvent.click(loginButtons[0]);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('navigates back to landing from login via home click', () => {
    render(<App />);
    const loginButtons = screen.getAllByText('Login');
    fireEvent.click(loginButtons[0]);
    expect(screen.getByText('Hello!')).toBeInTheDocument();

    const calcuraButtons = screen.getAllByText('Calcura');
    fireEvent.click(calcuraButtons[0]);
    expect(screen.getByText('Unlock Your Financial Health')).toBeInTheDocument();
  });

  it('navigates to About page', () => {
    render(<App />);
    const aboutButtons = screen.getAllByRole('button', { name: 'About' });
    fireEvent.click(aboutButtons[0]);
    expect(screen.getByText('About Calcura')).toBeInTheDocument();
  });

  it('navigates to Contact page', () => {
    render(<App />);
    const contactButtons = screen.getAllByRole('button', { name: 'Contact' });
    fireEvent.click(contactButtons[0]);
    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
  });
});
