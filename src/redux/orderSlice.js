import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basket: [],
  branch_id: 1,
};
const orderSlice = createSlice({
  name: "order/basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      const index = state.basket.findIndex(
        (item) => item.id === action.payload?.id
      );
 

      if (index === -1) {
        state.basket.push({
          ...action.payload,
          count: 1,
          price: 
            action?.payload?.max_price?.code === "UZS" ? 
            action.payload.max_price.price : 
            action.payload.max_price.price * action.payload.currency,
        });
      } else {
        state.basket[index].count += 1;
      }
    },
    removeFromBasket: (state, action) => {
      state.basket = state.basket.filter((item) => item.id !== action.payload);
    },
    decrementBasketItem: (state, action) => {
      const count = state.basket.find(
        (item) => item.id === action.payload
      ).count;
      if (count === 1) {
        state.basket.filter((item) => item.id !== action.payload);
      } else {
        const index = state.basket.findIndex(
          (item) => item.id === action.payload
        );
        state.basket[index].count -= 1;
      }
    },
    changeBranch: (state, action) => {
      state.branch_id = action.payload;
    },
    changeProductPrice: (state, action) => {
      const index = state.basket.findIndex(
        (item) => item.id === action.payload.id
      );
      if (action.payload.price !== null || action.payload.price !== "") {
        state.basket[index].price = action.payload.price;
      } else {
        state.basket[index].price = 0;
      }
    },
    changeProductCount: (state, action) => {
      const index = state?.basket.findIndex(
        (item) => item?.id === action.payload.id
      );
      if (action.payload.count !== null || action.payload.count !== "") {
        state.basket[index].count = action.payload.count;
      } else {
        state.basket[index].count = 1;
      }
    },
  },
});

export const {
  addToBasket,
  removeFromBasket,
  decrementBasketItem,
  changeBranch,
  changeProductPrice,
  changeProductCount,
} = orderSlice.actions;
const orderReducer = orderSlice.reducer;
export default orderReducer;
