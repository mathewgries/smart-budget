import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postShares } from "../../api/investing/orders/shares";
import { postOptions } from "../../api/investing/orders/options";
import { postVerticalSpread } from "../../api/investing/orders/verticalSpreads";

const initialState = {
  items: {
    sharesOrders: [],
    optionsOrders: [],
    verticalSpreadsOrders: [],
  },
  status: "idle",
  error: null,
};

export const addNewInvestingOrder = createAsyncThunk(
  "investingOrders/addNewInvestingOrder",
  async (newOrder) => {
    console.log(newOrder);
  }
);

export const saveNewSharesOrder = createAsyncThunk(
  "investingOrders/saveNewSharesOrder",
  async (newSharesOrder) => {
    return await postShares(newSharesOrder);
  }
);

export const saveNewOptionsOrder = createAsyncThunk(
  "investingOrders/saveNewOptionsOrder",
  async (newOptionsOrder) => {
    return await postOptions(newOptionsOrder);
  }
);

export const saveNewVerticalSpreadsOrder = createAsyncThunk(
  "investingOrders/saveNewVerticalSpreadsOrder",
  async (newVerticalSpreadsOrder) => {
    return await postVerticalSpread(newVerticalSpreadsOrder);
  }
);

export const investingOrdersSlice = createSlice({
  name: "investingOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(saveNewSharesOrder.fulfilled, (state, action) => {
      const { order } = action.payload;
      state.items.sharesOrders.push(order);
    });
    builder.addCase(saveNewOptionsOrder.fulfilled, (state, action) => {
      const { order } = action.payload;
      state.items.optionsOrders.push(order);
    });
		builder.addCase(saveNewVerticalSpreadsOrder.fulfilled, (state, action) => {
			const { order } = action.payload
			state.items.verticalSpreadsOrders.push(order)
		})
  },
});

export default investingOrdersSlice.reducer;

export const selectOrdersByAccountId = (state, accountId) =>
  state.investingOrders.items.filter(
    (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
  );
