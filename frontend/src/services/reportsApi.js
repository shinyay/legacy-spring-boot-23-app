import axios from 'axios';

// Create axios instance for reports
const reportsApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  timeout: 30000, // Longer timeout for reports
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reports API
export const reports = {
  // Sales Reports
  getSalesReport: (startDate, endDate) => {
    return reportsApi.get('/reports/sales', {
      params: { startDate, endDate }
    });
  },

  getSalesTrend: (startDate, endDate) => {
    return reportsApi.get('/reports/sales/trend', {
      params: { startDate, endDate }
    });
  },

  getSalesRanking: (category = null, limit = 10) => {
    const params = { limit };
    if (category) params.category = category;
    return reportsApi.get('/reports/sales/ranking', { params });
  },

  // Inventory Reports
  getInventoryReport: () => {
    return reportsApi.get('/reports/inventory');
  },

  getInventoryTurnover: (category = null) => {
    const params = {};
    if (category) params.category = category;
    return reportsApi.get('/reports/inventory/turnover', { params });
  },

  getReorderSuggestions: () => {
    return reportsApi.get('/reports/inventory/reorder');
  },

  // Customer Reports
  getCustomerAnalytics: () => {
    return reportsApi.get('/reports/customers');
  },

  getRFMAnalysis: () => {
    return reportsApi.get('/reports/customers/rfm');
  },

  getCustomerSegments: () => {
    return reportsApi.get('/reports/customers/segments');
  },

  // Tech Trends
  getTechTrends: () => {
    return reportsApi.get('/reports/tech-trends');
  },

  getCategoryTrends: (category) => {
    return reportsApi.get('/reports/tech-trends/categories', {
      params: { category }
    });
  },

  // Dashboard
  getDashboardKpis: () => {
    return reportsApi.get('/reports/dashboard/kpis');
  },

  getDashboardTrends: () => {
    return reportsApi.get('/reports/dashboard/trends');
  },

  // Custom Reports
  generateCustomReport: (reportData) => {
    return reportsApi.post('/reports/custom', reportData);
  },
};

export default reports;