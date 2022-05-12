import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { addNewUser } from "../users/usersSlice";
import { fetchAllData } from "../appSlice";
import { amplifyClient } from "../../api/amplifyClient";

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
  activeCategory: {},
  activeSubcategories: [],
  activeSubcategory: "",
  status: "idle",
  error: null,
});

export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async () => {
    return await amplifyClient.get("smartbudget", "/spending/categories");
  }
);

export const saveNewCategory = createAsyncThunk(
  "categories/saveNewCategory",
  async ({ category }) => {
    return await amplifyClient.post(
      { category },
      "smartbudget",
      "/spending/categories"
    );
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ category }) => {
    await amplifyClient.put(
      { category },
      "smartbudget",
      `/spending/categories/${category.id}`
    );
    return { category };
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ({ category, transactions }) => {
    await amplifyClient.remove(
      { category, transactions },
      "smartbudget",
      `/spending/categories/${category.id}`
    );
    return { category, transactions };
  }
);

export const saveNewSubcategory = createAsyncThunk(
  "categories/saveNewSubcategory",
  async ({ category, newSubcategory }) => {
    await amplifyClient.put(
      { category },
      "smartbudget",
      `/spending/categories/${category.id}`
    );
    return { category, newSubcategory };
  }
);

export const updateSubcategory = createAsyncThunk(
  "categories/updateSubcategory",
  async ({ category, subcategory }) => {
    await amplifyClient.put(
      { category },
      "smartbudget",
      `/spending/categories/${category.id}`
    );
    return { category, subcategory };
  }
);

export const deleteSubcategory = createAsyncThunk(
  "categories/deleteSubcategory",
  async ({ category, transactions }) => {
    await amplifyClient.put(
      { category, transactions },
      "smartbudget",
      `/spending/categories/${category.id}`
    );
    return { category, transactions };
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    activeCategoryUpdated(state, action) {
      const category = state.entities[action.payload];

      state.activeCategory = category;
      state.activeSubcategories = category.subcategories;
      state.activeSubcategory = category.subcategories[0];
    },
    activeSubcategoryUpdated(state, action) {
      const id = action.payload;
      state.activeSubcategory = state.activeCategory.subcategories.find(
        (subcategory) => subcategory.id === id
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addNewUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const categories = action.payload
          .filter((val) => val.Put.Item.type === "CATEGORY#")
          .map((val) => val.Put.Item);

        categoriesAdapter.upsertMany(state, categories);
        state.activeCategory = categories[0];
        state.activeSubcategories = categories[0].subcategories;
        state.activeSubcategory = categories[0].subcategories[0];
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
        const categories = action.payload.filter(
          (item) => item.type === "CATEGORY#"
        );

        if (categories[0]) {
          categoriesAdapter.upsertMany(state, categories);
          state.activeCategory = categories[0];
          state.activeSubcategories = categories[0].subcategories;
          state.activeSubcategory = categories[0].subcategories[0];
        } else {
          state = initialState;
        }
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(saveNewCategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const category = action.payload;

        categoriesAdapter.upsertOne(state, category);
        state.activeCategory = category;
        state.activeSubcategories = category.subcategories;
        state.activeSubcategory = category.subcategories[0];
      })
      .addCase(saveNewCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateCategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { category } = action.payload;

        categoriesAdapter.upsertOne(state, category);
        state.activeCategory = category;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteCategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.category;
        const existingActive = state.activeCategory;
        const categories = Object.values(state.entities).filter(
          (category) => category.id === id
        );
        categoriesAdapter.removeOne(state, id);
        if (!categories[0]) {
          state = initialState;
        } else if (existingActive.id === id) {
          state.activeCategory = categories[0];
          state.activeSubcategory = categories[0].subcategories[0];
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewSubcategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewSubcategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { category } = action.payload;
        const { newSubcategory } = action.payload;

        categoriesAdapter.upsertOne(state, category);
        state.activeCategory = category;
        state.activeSubcategories = category.subcategories;
        state.activeSubcategory = newSubcategory;
      })
      .addCase(saveNewSubcategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateSubcategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { category } = action.payload;
        const { subcategory } = action.payload;

        categoriesAdapter.upsertOne(state, category);
        state.activeCategory = category;
        state.activeSubcategory = subcategory;
        state.activeSubcategories = category.subcategories;
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteSubcategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { category } = action.payload;
        categoriesAdapter.upsertOne(state, category);

        state.activeCategory = category;
        state.activeSubcategories = category.subcategories;
        state.activeSubcategory = category.subcategories[0];
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { activeCategoryUpdated, activeSubcategoryUpdated } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectActiveCategory = (state) => state.categories.activeCategory;

export const selectActiveSubcategories = (state) =>
  state.categories.activeSubcategories;

export const selectActiveSubcategory = (state) =>
  state.categories.activeSubcategory;

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
} = categoriesAdapter.getSelectors((state) => state.categories);
