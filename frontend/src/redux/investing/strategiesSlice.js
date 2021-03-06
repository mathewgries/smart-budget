import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { updateSignals } from "./signalsSlice";
import { addNewUser } from "../users/usersSlice";
import { fetchAllData } from "../appSlice";
import { amplifyClient } from "../../api/amplifyClient";

const strategiesAdapter = createEntityAdapter();

const initialState = strategiesAdapter.getInitialState({
  activeStrategy: {},
  activeSignals: [],
  status: "idle",
  error: null,
});

export const getAllStrategies = createAsyncThunk(
  "strategies/getAllStrategies",
  async () => {
    return await amplifyClient.get("smartbudget", "/investing/strategies");
  }
);

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
      const id = action.payload;
      const strategy = Object.values(state.entities).find(
        (strategy) => strategy.id === id
      );

      state.activeStrategy = strategy;
      state.activeSignals = strategy.signals;
    },
    activeStrategyRemoved(state, action) {
      state.activeStrategy = undefined;
      state.activeSignals = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addNewUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const strategies = action.payload
          .filter((val) => val.Put.Item.type === "STRATEGY#")
          .map((val) => val.Put.Item);
        strategiesAdapter.upsertMany(state, strategies);
        if (strategies[0]) {
          state.activeStrategy = strategies[0];
          state.activeSignals = strategies[0].signals;
        }
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
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
        if (!strategies[0]) {
          state = initialState;
        }
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(updateSignals.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSignals.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { strategies } = action.payload;
        if (strategies) {
          strategiesAdapter.upsertMany(state, strategies);
          const activeStrategy = strategies.find(
            (strategy) => strategy.id === state.activeStrategy.id
          );
          if (activeStrategy) {
            state.activeStrategy = activeStrategy;
            state.activeSignals = activeStrategy.signals;
          }
        }
      })
      .addCase(updateSignals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
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
