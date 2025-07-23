const initialState = {
  items: [],
  loading: false,
  error: null,
  alerts: [],
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_INVENTORY_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_INVENTORY_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case 'FETCH_INVENTORY_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'FETCH_INVENTORY_ALERTS_SUCCESS':
      return {
        ...state,
        alerts: action.payload,
      };
    case 'UPDATE_INVENTORY_SUCCESS':
      return {
        ...state,
        items: state.items.map(item =>
          item.bookId === action.payload.bookId ? action.payload : item
        ),
      };
    default:
      return state;
  }
};

export default inventoryReducer;