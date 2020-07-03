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

const ADD_TO_CART = (item, key, restaurant) => {
  return {
    type: "ADD_TO_CART",
    details: {
      item: item,
      key: key,
      restaurant: restaurant,
    },
  };
};

const REMOVE_FROM_CART = (item) => {
  return {
    type: "REMOVE_FROM_CART",
    details: item.key,
  };
};

const CART_EMPTY = () => {
  return {
    type: "CART_EMPTY",
  };
};

const SET_MY_RESTAURANT_MENU = (menu) => {
  return {
    type: "SET_MY_RESTAURANT_MENU",
    details: menu,
  };
};

const ADD_MY_RESTAURANT_MENU_ITEM = (item) => {
  return {
    type: "ADD_MY_RESTAURANT_MENU_ITEM",
    details: item,
  };
};
const BUY_ORDER = (order) => {
  return {
    type: "BUY_ORDER",
    details: order,
  };
};

const reducer = (
  state = {
    user: {},
    cartMenu: [],
    orders: [],
    restaurants: [],
    myRestaurantMenu: [],
  },
  action
) => {
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
    case "ADD_TO_CART": {
      return { ...state, cartMenu: [...state.cartMenu, action.details] };
    }
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        cartMenu: state.cartMenu.filter(
          (newItem) => newItem.key !== action.details
        ),
      };
    }
    case "CART_EMPTY": {
      return { ...state, cartMenu: [] };
    }
    case "SET_MY_RESTAURANT_MENU": {
      return { ...state, myRestaurantMenu: action.details };
    }
    case "ADD_MY_RESTAURANT_MENU_ITEM": {
      return {
        ...state,
        myRestaurantMenu: [...state.myRestaurantMenu, action.details],
      };
    }
    case "BUY_ORDER": {
      return {
        ...state,
        orders: [...state.orders, action.details],
      };
    }
  }
};
let store = createStore(reducer);

export {
  SET_USER,
  SET_CART_MENU,
  SET_ORDERS,
  SET_RESTAURANTS,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CART_EMPTY,
  SET_MY_RESTAURANT_MENU,
  ADD_MY_RESTAURANT_MENU_ITEM,
  BUY_ORDER,
  store,
};
