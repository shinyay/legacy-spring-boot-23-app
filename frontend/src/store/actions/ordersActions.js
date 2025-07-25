import { ordersApi } from '../../services/api';

// Action types
export const ORDERS_LOADING = 'ORDERS_LOADING';
export const ORDERS_SUCCESS = 'ORDERS_SUCCESS';
export const ORDERS_ERROR = 'ORDERS_ERROR';
export const ORDER_DETAIL_LOADING = 'ORDER_DETAIL_LOADING';
export const ORDER_DETAIL_SUCCESS = 'ORDER_DETAIL_SUCCESS';
export const ORDER_DETAIL_ERROR = 'ORDER_DETAIL_ERROR';
export const ORDER_CREATE_LOADING = 'ORDER_CREATE_LOADING';
export const ORDER_CREATE_SUCCESS = 'ORDER_CREATE_SUCCESS';
export const ORDER_CREATE_ERROR = 'ORDER_CREATE_ERROR';
export const ORDER_UPDATE_LOADING = 'ORDER_UPDATE_LOADING';
export const ORDER_UPDATE_SUCCESS = 'ORDER_UPDATE_SUCCESS';
export const ORDER_UPDATE_ERROR = 'ORDER_UPDATE_ERROR';
export const ORDER_STATUS_COUNTS_LOADING = 'ORDER_STATUS_COUNTS_LOADING';
export const ORDER_STATUS_COUNTS_SUCCESS = 'ORDER_STATUS_COUNTS_SUCCESS';
export const ORDER_STATUS_COUNTS_ERROR = 'ORDER_STATUS_COUNTS_ERROR';

// Action creators
export const fetchOrders = (params = {}) => {
  return async (dispatch) => {
    dispatch({ type: ORDERS_LOADING });
    try {
      const response = await ordersApi.getOrders(params);
      dispatch({
        type: ORDERS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: ORDERS_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch orders'
      });
    }
  };
};

export const fetchOrderById = (id) => {
  return async (dispatch) => {
    dispatch({ type: ORDER_DETAIL_LOADING });
    try {
      const response = await ordersApi.getOrder(id);
      dispatch({
        type: ORDER_DETAIL_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: ORDER_DETAIL_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch order details'
      });
    }
  };
};

export const fetchOrderByNumber = (orderNumber) => {
  return async (dispatch) => {
    dispatch({ type: ORDER_DETAIL_LOADING });
    try {
      const response = await ordersApi.getOrderByNumber(orderNumber);
      dispatch({
        type: ORDER_DETAIL_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: ORDER_DETAIL_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch order details'
      });
    }
  };
};

export const createOrder = (orderData) => {
  return async (dispatch) => {
    dispatch({ type: ORDER_CREATE_LOADING });
    try {
      const response = await ordersApi.createOrder(orderData);
      dispatch({
        type: ORDER_CREATE_SUCCESS,
        payload: response.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: ORDER_CREATE_ERROR,
        payload: error.response?.data?.message || 'Failed to create order'
      });
      throw error;
    }
  };
};

export const confirmOrder = (id) => {
  return async (dispatch) => {
    dispatch({ type: ORDER_UPDATE_LOADING });
    try {
      const response = await ordersApi.confirmOrder(id);
      dispatch({
        type: ORDER_UPDATE_SUCCESS,
        payload: response.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_ERROR,
        payload: error.response?.data?.message || 'Failed to confirm order'
      });
      throw error;
    }
  };
};

export const pickOrder = (id) => {
  return async (dispatch) => {
    dispatch({ type: ORDER_UPDATE_LOADING });
    try {
      const response = await ordersApi.pickOrder(id);
      dispatch({
        type: ORDER_UPDATE_SUCCESS,
        payload: response.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_ERROR,
        payload: error.response?.data?.message || 'Failed to pick order'
      });
      throw error;
    }
  };
};

export const shipOrder = (id) => {
  return async (dispatch) => {
    dispatch({ type: ORDER_UPDATE_LOADING });
    try {
      const response = await ordersApi.shipOrder(id);
      dispatch({
        type: ORDER_UPDATE_SUCCESS,
        payload: response.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_ERROR,
        payload: error.response?.data?.message || 'Failed to ship order'
      });
      throw error;
    }
  };
};

export const deliverOrder = (id) => {
  return async (dispatch) => {
    dispatch({ type: ORDER_UPDATE_LOADING });
    try {
      const response = await ordersApi.deliverOrder(id);
      dispatch({
        type: ORDER_UPDATE_SUCCESS,
        payload: response.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_ERROR,
        payload: error.response?.data?.message || 'Failed to deliver order'
      });
      throw error;
    }
  };
};

export const fetchOrderStatusCounts = () => {
  return async (dispatch) => {
    dispatch({ type: ORDER_STATUS_COUNTS_LOADING });
    try {
      const response = await ordersApi.getStatusCounts();
      dispatch({
        type: ORDER_STATUS_COUNTS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: ORDER_STATUS_COUNTS_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch order status counts'
      });
    }
  };
};