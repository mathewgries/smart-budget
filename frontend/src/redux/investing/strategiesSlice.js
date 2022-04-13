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
    await amplifyClient.put(
      { strategy },
      "smartbudget",
      `/investing/strategies/${strategy.id}`
    );
    return { strategy };
  }
);

export const deleteStrategy = createAsyncThunk(
  "strategies/deleteStrategy",
  async ({ strategy, orders }) => {
    await amplifyClient.remove(
      { strategy, orders },
      "smartbudget",
      `/investing/strategies/${strategy.id}`
    );
    return { strategy, orders };
  }
);

export const strategiesSlice = createSlice({
  name: "strategies",
  initialState,
  reducers: {
    activeStrategyUpdated(state, action) {
      const strategy = state.entities[action.payload];

      state.activeStrategy = strategy;
      state.activeSignals = strategy.signals;
    },
    activeStrategyRemoved(state, action) {
      state.activeStrategy = undefined;
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
        if (strategies[0]) {
          state.activeStrategy = strategies[0];
          state.activeSignals = strategies[0].signals;
        }
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
    builder
      .addCase(deleteStrategy.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.strategy;
        const strategies = Object.values(state.entities).filter(
          (strategy) => strategy.id !== id
        );
        strategiesAdapter.removeOne(state, id);
				if(!strategies[0]){
					state = initialState
				}
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { activeStrategyUpdated, activeStrategyRemoved } =
  strategiesSlice.actions;

export default strategiesSlice.reducer;

export const selectActiveStrategy = (state) => state.strategies.activeStrategy;
export const selectActiveSignals = (state) => state.strategies.activeSignals;

export const {
  selectAll: selectAllStrategies,
  selectById: selectStrategyById,
  selectIds: selectStrategiesIds,
} = strategiesAdapter.getSelectors((state) => state.strategies);
