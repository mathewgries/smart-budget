import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { addNewUser, fetchAllData } from "../users/usersSlice";
import { amplifyClient } from "../../api/amplifyClient";

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
  activeCategory: {},
  activeSubcategory: "",
  status: "idle",
  error: null,
});

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return amplifyClient.get("smartbudget", "/spending/categories");
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

      const subcategories = category.subcategories;
      state.activeSubcategory =
        subcategories.length > 0 ? subcategories[0] : "No subcategories";
    },
    activeSubcategoryUpdated(state, action) {
      state.activeSubcategory = action.payload;
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
        categoriesAdapter.upsertMany(state, categories);
        state.activeCategory = categories[0];
        state.activeSubcategory = categories[0].subcategories[0];
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        categoriesAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewCategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const category = action.payload;
        const subcategories = category.subcategories;
        categoriesAdapter.upsertOne(state, category);

        state.activeCategory = action.payload;
        state.activeSubcategory =
          subcategories.length > 0 ? subcategories[0] : "No subcategories";
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
        const subcategories = category.subcategories;
        categoriesAdapter.upsertOne(state, category);
        state.activeCategory = category;
        state.activeSubcategory = subcategories[subcategories.length - 1];
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
        categoriesAdapter.removeOne(state, id);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
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
        const subcategories = category.subcategories;
        state.activeSubcategory =
          subcategories.length > 0 ? subcategories[0] : "No subcategories";
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

export const selectCategoryNames = (state) =>
  Object.values(state.categories.entities).map((cat) => cat.categoryName);

export const selectSubcategories = (state, category) =>
  Object.values(state.categories.entities).map((cat) => cat.categoryName);

export const selectActiveCategory = (state) => state.categories.activeCategory;

export const selectActiveSubcategory = (state) =>
  state.categories.activeSubcategory;

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
} = categoriesAdapter.getSelectors((state) => state.categories);
