// Enhanced Inventory Report E2E Test - Phase 1
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import InventoryReport from '../components/InventoryReport';

// Mock reports API
jest.mock('../services/reportsApi', () => ({
  getInventoryReport: jest.fn(),
  getEnhancedInventoryReport: jest.fn(),
}));

import reports from '../services/reportsApi';

// Mock store
const createMockStore = (initialState = {}) => createStore(() => ({
  inventory: {
    reports: [],
    loading: false,
    error: null,
    ...initialState,
  }
}), applyMiddleware(thunk));

// Mock inventory report data
const mockBasicReportData = {
  reportDate: '2025-01-18',
  totalProducts: 25,
  lowStockCount: 3,
  outOfStockCount: 1,
  totalInventoryValue: 87500.00,
  averageTurnoverRate: 4.2,
  deadStockItems: 2,
  deadStockValue: 7000.00,
  obsolescenceRiskIndex: 25.5,
  items: [
    {
      bookId: 1,
      title: 'Java Programming Basics',
      category: 'Java',
      currentStock: 15,
      reorderLevel: 5,
      stockStatus: 'NORMAL',
      unitValue: 3500.00,
      totalValue: 52500.00
    },
    {
      bookId: 2,
      title: 'Advanced React Development',
      category: 'React',
      currentStock: 2,
      reorderLevel: 5,
      stockStatus: 'LOW',
      unitValue: 4200.00,
      totalValue: 8400.00
    }
  ],
  reorderSuggestions: [
    {
      bookId: 2,
      title: 'Advanced React Development',
      currentStock: 2,
      suggestedOrder: 10,
      urgency: 'HIGH',
      daysUntilStockout: 5
    }
  ],
  turnoverSummary: {
    averageTurnoverRate: 4.2,
    fastestMovingCategory: 'Java',
    slowestMovingCategory: 'Database'
  }
};

const mockEnhancedReportData = {
  ...mockBasicReportData,
  totalProducts: 15, // Filtered result
  averageTurnoverRate: 5.1,
  deadStockItems: 1,
  obsolescenceRiskIndex: 15.2,
  items: [
    {
      bookId: 1,
      title: 'Java Programming Basics',
      category: 'Java',
      currentStock: 15,
      reorderLevel: 5,
      stockStatus: 'NORMAL',
      unitValue: 3500.00,
      totalValue: 52500.00
    }
  ]
};

describe('Enhanced Inventory Report E2E Tests - Phase 1', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore();
    jest.clearAllMocks();
    
    // Setup default mock responses
    reports.getInventoryReport.mockResolvedValue({ data: mockBasicReportData });
    reports.getEnhancedInventoryReport.mockResolvedValue({ data: mockEnhancedReportData });
  });

  test('renders basic inventory report with enhanced KPIs', async () => {
    render(
      <Provider store={mockStore}>
        <InventoryReport />
      </Provider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('在庫レポート（高度分析対応）')).toBeInTheDocument();
    });

    // Check basic KPIs
    expect(screen.getByText('25')).toBeInTheDocument(); // Total products
    expect(screen.getByText('3')).toBeInTheDocument(); // Low stock
    expect(screen.getByText('1')).toBeInTheDocument(); // Out of stock
    expect(screen.getByText('¥87,500')).toBeInTheDocument(); // Total value

    // Check enhanced KPIs
    expect(screen.getByText('4.2')).toBeInTheDocument(); // Average turnover rate
    expect(screen.getByText('2')).toBeInTheDocument(); // Dead stock items
    expect(screen.getByText('26')).toBeInTheDocument(); // Obsolescence risk index (rounded)
    expect(screen.getByText('8.0%')).toBeInTheDocument(); // Dead stock rate
  });

  test('shows filtering controls when expanded', async () => {
    render(
      <Provider store={mockStore}>
        <InventoryReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('フィルタリング・検索')).toBeInTheDocument();
    });

    // Click to expand filters
    const filterToggle = screen.getByText('フィルタリング・検索').closest('div');
    fireEvent.click(filterToggle);

    // Check filter controls are visible
    await waitFor(() => {
      expect(screen.getByLabelText('技術カテゴリ')).toBeInTheDocument();
      expect(screen.getByLabelText('技術レベル')).toBeInTheDocument();
      expect(screen.getByLabelText('出版社')).toBeInTheDocument();
      expect(screen.getByLabelText('在庫状況')).toBeInTheDocument();
      expect(screen.getByLabelText('価格帯')).toBeInTheDocument();
      expect(screen.getByLabelText('出版年')).toBeInTheDocument();
    });

    // Check filter buttons
    expect(screen.getByText('フィルタ適用')).toBeInTheDocument();
    expect(screen.getByText('クリア')).toBeInTheDocument();
  });

  test('applies filters and calls enhanced API', async () => {
    render(
      <Provider store={mockStore}>
        <InventoryReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('フィルタリング・検索')).toBeInTheDocument();
    });

    // Expand filters
    const filterToggle = screen.getByText('フィルタリング・検索').closest('div');
    fireEvent.click(filterToggle);

    await waitFor(() => {
      expect(screen.getByLabelText('技術カテゴリ')).toBeInTheDocument();
    });

    // Select Java category
    const categorySelect = screen.getByLabelText('技術カテゴリ');
    fireEvent.click(categorySelect);
    fireEvent.click(screen.getByText('Java'));

    // Apply filters
    const applyButton = screen.getByText('フィルタ適用');
    fireEvent.click(applyButton);

    // Verify enhanced API was called with filters
    await waitFor(() => {
      expect(reports.getEnhancedInventoryReport).toHaveBeenCalledWith({
        category: 'Java'
      });
    });

    // Verify filtered results are displayed
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument(); // Filtered total products
    });
  });

  test('clears filters and returns to basic report', async () => {
    render(
      <Provider store={mockStore}>
        <InventoryReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('フィルタリング・検索')).toBeInTheDocument();
    });

    // Expand filters
    const filterToggle = screen.getByText('フィルタリング・検索').closest('div');
    fireEvent.click(filterToggle);

    await waitFor(() => {
      expect(screen.getByLabelText('技術カテゴリ')).toBeInTheDocument();
    });

    // Select a filter
    const categorySelect = screen.getByLabelText('技術カテゴリ');
    fireEvent.click(categorySelect);
    fireEvent.click(screen.getByText('Java'));

    // Apply filters
    fireEvent.click(screen.getByText('フィルタ適用'));

    // Clear filters
    const clearButton = screen.getByText('クリア');
    fireEvent.click(clearButton);

    // Verify basic API was called again
    await waitFor(() => {
      expect(reports.getInventoryReport).toHaveBeenCalledTimes(2); // Initial load + after clear
    });
  });

  test('shows export options', async () => {
    render(
      <Provider store={mockStore}>
        <InventoryReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('CSV')).toBeInTheDocument();
      expect(screen.getByText('Excel')).toBeInTheDocument();
    });

    // Test CSV export
    const csvButton = screen.getByText('CSV');
    fireEvent.click(csvButton);

    // Verify alert is shown (mock implementation)
    // In actual implementation, this would trigger file download
  });

  test('displays inventory items table correctly', async () => {
    render(
      <Provider store={mockStore}>
        <InventoryReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Java Programming Basics')).toBeInTheDocument();
      expect(screen.getByText('Advanced React Development')).toBeInTheDocument();
    });

    // Check table headers and data
    expect(screen.getByText('商品名')).toBeInTheDocument();
    expect(screen.getByText('カテゴリ')).toBeInTheDocument();
    expect(screen.getByText('在庫数')).toBeInTheDocument();
    expect(screen.getByText('ステータス')).toBeInTheDocument();

    // Check specific data
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // Stock quantity
    expect(screen.getByText('2')).toBeInTheDocument(); // Stock quantity
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    reports.getInventoryReport.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Provider store={mockStore}>
        <InventoryReport />
      </Provider>
    );

    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching inventory report:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});