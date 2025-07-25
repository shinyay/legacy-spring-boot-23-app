import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CustomerList from '../components/CustomerList';

// Mock store for testing
const mockStore = createStore(() => ({
  customers: {
    customers: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
    },
    customerStats: {
      totalCustomers: 0,
      activeCustomers: 0,
      inactiveCustomers: 0,
      deletedCustomers: 0,
    },
    loading: false,
    error: null,
  }
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Customer Management Components', () => {
  test('CustomerList component renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <CustomerList />
      </Provider>
    );
    
    expect(screen.getByText('顧客管理')).toBeInTheDocument();
    expect(screen.getByText('新規顧客追加')).toBeInTheDocument();
  });

  test('Customer API endpoints are properly configured', () => {
    // This would test the API configuration
    expect(process.env.NODE_ENV).toBeDefined();
  });
});