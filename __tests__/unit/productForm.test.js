import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ProductForm from '../../components/ProductForm';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    route: '/',
    pathname: '/mock-path',
    query: '',
    asPath: '',
  }),
}));


describe('ProductForm', () => {
  test('renders product form with required elements', () => {
    render(<ProductForm />);

    // Check if elements are rendered
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Catégorie')).toBeInTheDocument();
    expect(screen.getByLabelText('Photos')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Prix (euro)')).toBeInTheDocument();
    expect(screen.getByText('Enregistrer')).toBeInTheDocument();
  });
});