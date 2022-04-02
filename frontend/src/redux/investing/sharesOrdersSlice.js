import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { put, post, get } from "../../api/investing/orders/shares";
import { fetchAllData } from "../users/usersSlice";

const sharesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.openDate.localeCompare(a.openDate),
});

const initialState = sharesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchSharesOrders = createAsyncThunk(
  "sharesOrders/fetchSharesOrders",
  async () => {
    const results = await get();
    return results;
  }
);

export const saveNewSharesOrder = createAsyncThunk(
  "sharesOrders/saveNewSharesOrder",
  async (newSharesOrder) => {
    const result = await post(newSharesOrder);
    return result.order;
  }
);

export const updateSharesOrder = createAsyncThunk(
  "sharesOrders/updateSharesOrder",
  async (updatedOrder) => {
    await put(updatedOrder);
    delete updatedOrder.accountId;
    delete updatedOrder.accountBalance;
    return updatedOrder;
  }
);

export const sharesOrdersSlice = createSlice({
  name: "sharesOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const shares = action.payload.filter(
          (item) => item.type === "ORDER#SHARES#"
        );
        sharesAdapter.setAll(state, shares)
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchSharesOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSharesOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        sharesAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchSharesOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewSharesOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(saveNewSharesOrder.fulfilled, sharesAdapter.upsertOne)
      .addCase(saveNewSharesOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
			builder
			.addCase(updateSharesOrder.pending, (state, action) => {
				state.status = "saving"
			})
			.addCase(updateSharesOrder.fulfilled, sharesAdapter.upsertOne)
			.addCase(updateSharesOrder.rejected, (state, action) => {
				state.status = "failed"
				state.error = action.error.message;
			})
  },
});

export default sharesOrdersSlice.reducer;

export const selectSharesOrdersByAccounGSI = (state, gsi) =>
  Object.values(state.sharesOrders.entities).filter(
    (order) => order.GSI1_PK === gsi
  );

export const selectSharesCountByAccountGSI = (state, gsi) =>
  Object.values(state.sharesOrders.entities).filter(
    (order) => order.GSI1_PK === gsi
  ).length;

export const selectSharesPLByAccountGSI = (state, gsi) => {
  const totals = Object.values(state.sharesOrders.entities)
    .filter((order) => order.GSI1_PK === gsi)
    .map((order) => Number.parseFloat(order.profitLoss));

  let initialValue = 0;
  return totals.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
};

export const {
  selectAll: selectAllSharesOrders,
  selectById: selectSharesOrderById,
  selectIds: selectShareOrdersIds,
} = sharesAdapter.getSelectors((state) => state.sharesOrders);
