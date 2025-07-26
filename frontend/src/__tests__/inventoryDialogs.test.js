import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReceiveStockDialog from '../components/ReceiveStockDialog';
import SellStockDialog from '../components/SellStockDialog';

// Mock inventory data
const mockInventory = {
  id: 1,
  bookId: 1,
  bookTitle: 'テスト書籍',
  isbn13: '9781234567890',
  storeStock: 10,
  warehouseStock: 5,
  availableStock: 15,
};

// Simple store for testing
const mockReducer = (state = {}, action) => state;
const store = createStore(mockReducer, applyMiddleware(thunk));

describe('Inventory Dialogs', () => {
  test('ReceiveStockDialog renders with book information', () => {
    render(
      <Provider store={store}>
        <ReceiveStockDialog
          open={true}
          onClose={() => {}}
          inventory={mockInventory}
          onSuccess={() => {}}
        />
      </Provider>
    );

    expect(screen.getByText('入荷処理')).toBeInTheDocument();
    expect(screen.getByText('テスト書籍')).toBeInTheDocument();
    expect(screen.getByText('9781234567890')).toBeInTheDocument();
  });

  test('SellStockDialog renders with book information', () => {
    render(
      <Provider store={store}>
        <SellStockDialog
          open={true}
          onClose={() => {}}
          inventory={mockInventory}
          onSuccess={() => {}}
        />
      </Provider>
    );

    expect(screen.getByText('販売処理')).toBeInTheDocument();
    expect(screen.getByText('テスト書籍')).toBeInTheDocument();
    expect(screen.getByText('9781234567890')).toBeInTheDocument();
  });

  test('SellStockDialog disables sell button when no store stock', () => {
    const noStockInventory = { ...mockInventory, storeStock: 0 };
    
    render(
      <Provider store={store}>
        <SellStockDialog
          open={true}
          onClose={() => {}}
          inventory={noStockInventory}
          onSuccess={() => {}}
        />
      </Provider>
    );

    const sellButton = screen.getByText('販売実行');
    expect(sellButton).toBeDisabled();
  });

  test('Dialog validation works correctly', () => {
    const { container } = render(
      <Provider store={store}>
        <ReceiveStockDialog
          open={true}
          onClose={() => {}}
          inventory={mockInventory}
          onSuccess={() => {}}
        />
      </Provider>
    );

    const quantityInput = screen.getByLabelText(/入荷数量/);
    const submitButton = screen.getByText('入荷実行');

    // Test with invalid quantity
    fireEvent.change(quantityInput, { target: { value: '-1' } });
    fireEvent.click(submitButton);

    // Should show validation error
    expect(screen.getByText(/正の整数を入力してください/)).toBeInTheDocument();
  });

  test('Components are properly exported', () => {
    expect(ReceiveStockDialog).toBeDefined();
    expect(SellStockDialog).toBeDefined();
  });
});