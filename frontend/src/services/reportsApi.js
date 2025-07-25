import axios from 'axios';

// Create axios instance for reports
const reportsApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  timeout: 30000, // Longer timeout for reports
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
reportsApi.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
reportsApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 400) {
        throw new Error(data.message || 'リクエストが無効です');
      } else if (status === 401) {
        throw new Error('認証が必要です');
      } else if (status === 403) {
        throw new Error('アクセス権限がありません');
      } else if (status === 404) {
        throw new Error('データが見つかりません');
      } else if (status >= 500) {
        throw new Error('サーバーエラーが発生しました');
      }
      
      throw new Error(data.message || 'エラーが発生しました');
    } else if (error.request) {
      // Network error
      throw new Error('ネットワークエラーが発生しました');
    } else {
      // Something else happened
      throw new Error('予期しないエラーが発生しました');
    }
  }
);

// Reports API with enhanced error handling
export const reports = {
  // Sales Reports
  getSalesReport: async (startDate, endDate) => {
    try {
      const response = await reportsApi.get('/reports/sales', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Sales report error:', error);
      throw error;
    }
  },

  getSalesTrend: async (startDate, endDate) => {
    try {
      const response = await reportsApi.get('/reports/sales/trend', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Sales trend error:', error);
      throw error;
    }
  },

  getSalesRanking: async (category = null, limit = 10) => {
    try {
      const params = { limit };
      if (category) params.category = category;
      const response = await reportsApi.get('/reports/sales/ranking', { params });
      return response.data;
    } catch (error) {
      console.error('Sales ranking error:', error);
      throw error;
    }
  },

  // Inventory Reports
  getInventoryReport: async () => {
    try {
      const response = await reportsApi.get('/reports/inventory');
      return response.data;
    } catch (error) {
      console.error('Inventory report error:', error);
      throw error;
    }
  },

  getInventoryTurnover: async (category = null) => {
    try {
      const params = {};
      if (category) params.category = category;
      const response = await reportsApi.get('/reports/inventory/turnover', { params });
      return response.data;
    } catch (error) {
      console.error('Inventory turnover error:', error);
      throw error;
    }
  },

  getReorderSuggestions: async () => {
    try {
      const response = await reportsApi.get('/reports/inventory/reorder');
      return response.data;
    } catch (error) {
      console.error('Reorder suggestions error:', error);
      throw error;
    }
  },

  // Customer Reports
  getCustomerAnalytics: async () => {
    try {
      const response = await reportsApi.get('/reports/customers');
      return response.data;
    } catch (error) {
      console.error('Customer analytics error:', error);
      throw error;
    }
  },

  getRFMAnalysis: async () => {
    try {
      const response = await reportsApi.get('/reports/customers/rfm');
      return response.data;
    } catch (error) {
      console.error('RFM analysis error:', error);
      throw error;
    }
  },

  getCustomerSegments: async () => {
    try {
      const response = await reportsApi.get('/reports/customers/segments');
      return response.data;
    } catch (error) {
      console.error('Customer segments error:', error);
      throw error;
    }
  },

  // Tech Trends
  getTechTrends: async (days = 90) => {
    try {
      const response = await reportsApi.get('/reports/tech-trends', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Tech trends error:', error);
      throw error;
    }
  },

  getCategoryTrends: async (category, days = 90) => {
    try {
      const response = await reportsApi.get('/reports/tech-trends/categories', {
        params: { category, days }
      });
      return response.data;
    } catch (error) {
      console.error('Category trends error:', error);
      throw error;
    }
  },

  // Dashboard
  getDashboardKpis: async () => {
    try {
      const response = await reportsApi.get('/reports/dashboard/kpis');
      return response.data;
    } catch (error) {
      console.error('Dashboard KPIs error:', error);
      throw error;
    }
  },

  getDashboardTrends: async () => {
    try {
      const response = await reportsApi.get('/reports/dashboard/trends');
      return response.data;
    } catch (error) {
      console.error('Dashboard trends error:', error);
      throw error;
    }
  },

  // Custom Reports
  generateCustomReport: async (reportData) => {
    try {
      const response = await reportsApi.post('/reports/custom', reportData);
      return response.data;
    } catch (error) {
      console.error('Custom report error:', error);
      throw error;
    }
  },
};

export default reports;