import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { fetchAllData } from "../users/usersSlice";
import { amplifyClient } from "../../api/amplifyClient";

const strategiesAdapter = createEntityAdapter();

const initialState = strategiesAdapter.getInitialState({
  activeStrategy: {},
  activeSignals: [],
  status: "idle",
  error: null,
});

// export const fetchOptionsOrders = createAsyncThunk(
//   "optionsOrders/fetchOptionsOrders",
//   async () => {
//     return amplifyClient.get("smartbudget", "/investing/orders/options");
//   }
// );

export const saveStrategy = createAsyncThunk(
  "strategies/saveStrategy",
  async ({ strategy }) => {
    return await amplifyClient.post(
      { strategy },
      "smartbudget",
      "/investing/strategies"
    );
  }
);

export const updateStrategy = createAsyncThunk(
  "strategies/updateStrategy",
  async ({ strategy }) => {
    console.log(strategy);
    await amplifyClient.put(
      { strategy },
      "smartbudget",
      `/investing/strategies/${strategy.id}`
    );
    return { strategy };
  }
);

// export const deleteOptionsOrder = createAsyncThunk(
//   "optionsOrders/deleteOptionsOrder",
//   async ({ order, account }) => {
//     await amplifyClient.remove(
//       { order, account },
//       "smartbudget",
//       `/investing/orders/${order.id}`
//     );
//     return { order, account };
//   }
// );

export const strategiesSlice = createSlice({
  name: "strategies",
  initialState,
  reducers: {
    activeStrategyUpdated(state, action) {
      const strategy = action.payload;
      state.activeStrategy = strategy;
      state.activeSignals = strategy.signals;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const strategies = action.payload.filter(
          (item) => item.type === "STRATEGY#"
        );
        strategiesAdapter.setAll(state, strategies);
        state.activeStrategy = strategies[0];
        state.activeSignals = strategies[0].signals;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(saveStrategy.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveStrategy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const strategy = action.payload;
        strategiesAdapter.upsertOne(state, strategy);
        state.activeStrategy = strategy;
        state.activeSignals = strategy.signals;
      })
      .addCase(saveStrategy.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(updateStrategy.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateStrategy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { strategy } = action.payload;
        strategiesAdapter.upsertOne(state, strategy);
        state.activeStrategy = strategy;
        state.activeSignals = strategy.signals;
      })
      .addCase(updateStrategy.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { activeStrategyUpdated } = strategiesSlice.actions;

export default strategiesSlice.reducer;

export const selectActiveStrategy = (state) => state.strategies.activeStrategy;
export const selectActiveSignals = (state) => state.strategies.activeSignals;

export const {
  selectAll: selectAllStrategies,
  selectById: selectStrategiesId,
  selectIds: selectStrategiesIds,
} = strategiesAdapter.getSelectors((state) => state.strategies);
