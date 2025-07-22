import axios from 'axios';

const API_BASE_URL = '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const booksApi = {
  getBooks: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', keyword = '') => {
    const params = { page, size, sortBy, sortDir };
    if (keyword) params.keyword = keyword;
    return api.get('/books', { params });
  },
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (book) => api.post('/books', book),
  updateBook: (id, book) => api.put(`/books/${id}`, book),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getBookByIsbn: (isbn13) => api.get(`/books/isbn/${isbn13}`),
};

export const inventoryApi = {
  getInventory: () => api.get('/inventory'),
  getInventoryByBookId: (bookId) => api.get(`/inventory/${bookId}`),
  getInventoryAlerts: () => api.get('/inventory/alerts'),
  getOutOfStockItems: () => api.get('/inventory/out-of-stock'),
  receiveStock: (bookId, quantity, location) => 
    api.post('/inventory/receive', { bookId, quantity, location }),
  sellStock: (bookId, quantity) => 
    api.post('/inventory/sell', { bookId, quantity }),
  adjustStock: (bookId, storeStock, warehouseStock) => 
    api.put('/inventory/adjust', { bookId, storeStock, warehouseStock }),
};

export default api;