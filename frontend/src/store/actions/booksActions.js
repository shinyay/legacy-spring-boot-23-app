import { booksApi } from '../services/api';

export const fetchBooks = (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', keyword = '') => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_BOOKS_REQUEST' });
    try {
      const response = await booksApi.getBooks(page, size, sortBy, sortDir, keyword);
      dispatch({ type: 'FETCH_BOOKS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_BOOKS_FAILURE', payload: error.message });
    }
  };
};

export const createBook = (book) => {
  return async (dispatch) => {
    try {
      const response = await booksApi.createBook(book);
      dispatch({ type: 'ADD_BOOK_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
};

export const updateBook = (id, book) => {
  return async (dispatch) => {
    try {
      const response = await booksApi.updateBook(id, book);
      dispatch({ type: 'UPDATE_BOOK_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
};

export const deleteBook = (id) => {
  return async (dispatch) => {
    try {
      await booksApi.deleteBook(id);
      dispatch({ type: 'DELETE_BOOK_SUCCESS', payload: id });
    } catch (error) {
      throw error;
    }
  };
};