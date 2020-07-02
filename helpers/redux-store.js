import { createStore } from "redux";

const SET_USER = (user) => {
  return {
    type: "SET_USER",
    details: user,
  };
};

const SET_CART_MENU = (cart) => {
  return {
    type: "SET_CART_MENU",
    details: cart,
  };
};

const SET_ORDERS = (orders) => {
  return {
    type: "SET_ORDERS",
    details: orders,
  };
};

const SET_RESTAURANTS = (restaurants) => {
  return {
    type: "SET_RESTAURANTS",
    details: restaurants,
  };
};

const reducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case "SET_USER": {
      return { ...state, user: action.details };
    }
    case "SET_CART_MENU": {
      return { ...state, cartMenu: action.details };
    }
    case "SET_ORDERS": {
      return { ...state, orders: action.details };
    }
    case "SET_RESTAURANTS": {
      return { ...state, restaurants: action.details };
    }
  }
};
let store = createStore(reducer);

export { SET_USER, SET_CART_MENU, SET_ORDERS, SET_RESTAURANTS, store };
