const initialState = {
  books: [],
  loading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_BOOKS_SUCCESS':
      return {
        ...state,
        loading: false,
        books: action.payload.content,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.number,
      };
    case 'FETCH_BOOKS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_BOOK_SUCCESS':
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    case 'UPDATE_BOOK_SUCCESS':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id ? action.payload : book
        ),
      };
    case 'DELETE_BOOK_SUCCESS':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload),
      };
    default:
      return state;
  }
};

export default booksReducer;