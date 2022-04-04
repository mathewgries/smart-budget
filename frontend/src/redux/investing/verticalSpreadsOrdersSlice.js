import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { put, post, get } from "../../api/investing/orders/verticalSpreads";
import { remove } from "../../api/investing/orders/shared";
import { fetchAllData } from "../users/usersSlice";

const vertSpreadsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.openDate.toString().localeCompare(a.openDate),
});

const initialState = vertSpreadsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchVerticalSpreadsOrders = createAsyncThunk(
  "verticalSpreadsOrders/fetchVerticalSpreadsOrders",
  async () => {
    const results = await get();
    return results;
  }
);

export const saveNewVerticalSpreadsOrder = createAsyncThunk(
  "verticalSpreadsOrders/saveNewVerticalSpreadsOrder",
  async (newVerticalSpreadsOrder) => {
    return await post(newVerticalSpreadsOrder);
  }
);

export const updateVerticalSpreadOrder = createAsyncThunk(
  "verticalSpreadsOrders/updateVerticalSpreadOrder",
  async (updatedOrder) => {
    await put(updatedOrder);
    return updatedOrder;
  }
);

export const deleteVerticalSpreadOrder = createAsyncThunk(
  "verticalSpreadsOrders/deleteVerticalSpreadOrder",
  async (data) => {
    await remove(data);
    return data;
  }
);

export const verticalSpreadsOrdersSlice = createSlice({
  name: "verticalSpreadsOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const verts = action.payload.filter(
          (item) => item.type === "ORDER#VERTSPREADS#"
        );
        vertSpreadsAdapter.setAll(state, verts);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchVerticalSpreadsOrders.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchVerticalSpreadsOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        vertSpreadsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchVerticalSpreadsOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewVerticalSpreadsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewVerticalSpreadsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        vertSpreadsAdapter.addOne(state, order);
      })
      .addCase(saveNewVerticalSpreadsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateVerticalSpreadOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateVerticalSpreadOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        vertSpreadsAdapter.upsertOne(state, order);
      })
      .addCase(updateVerticalSpreadOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteVerticalSpreadOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteVerticalSpreadOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.order;
        vertSpreadsAdapter.removeOne(state, id);
      })
      .addCase(deleteVerticalSpreadOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default verticalSpreadsOrdersSlice.reducer;

export const selectVerticalSpreadsOrdersByAccountGSI = (state, gsi) =>
  Object.values(state.verticalSpreadsOrders.entities).filter(
    (order) => order.GSI1_PK === gsi
  );

export const selectVerticalSpreadsCountByAccountGSI = (state, gsi) =>
  Object.values(state.verticalSpreadsOrders.entities).map(
    (order) => order.GSI1_PK === gsi
  ).length;

export const selectVerticalSpreadsPLByAccountGSI = (state, gsi) => {
  const totals = Object.values(state.verticalSpreadsOrders.entities)
    .filter((order) => order.GSI1_PK === gsi)
    .map((order) => Number.parseFloat(order.profitLoss));

  let initialValue = 0;
  return totals.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
};

export const {
  selectAll: selectAllVerticalSpreadsOrders,
  selectById: selectVerticalSpreadsOrderById,
  selectIds: selectVerticalSpreadsOrdersIds,
} = vertSpreadsAdapter.getSelectors((state) => state.verticalSpreadsOrders);
