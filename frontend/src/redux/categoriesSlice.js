import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../api/categories";

const initialState = {
  items: {},
  categories: [],
  subcategories: [],
  activeCategory: "",
  activeSubcategory: "",
  status: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await get();
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    updateActiveCategory(state, action) {
      state.activeCategory = action.payload;
      state.subcategories = state.items[state.activeCategory];
      state.activeSubcategory = state.subcategories[0];
      console.log(action);
    },
    updateActiveSubcategory(state, action) {
      state.activeSubcategory = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { categoryMap } = action.payload;
        state.items = categoryMap;
        state.categories = Object.keys(categoryMap);
        state.activeCategory = state.categories[0];
        state.subcategories = state.items[state.activeCategory];
        state.activeSubcategory = state.subcategories[0];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // builder.addCase(addNewCategory.fulfilled, (state, action) => {
    //   state.items.push(action.payload);
    // });
    // builder.addCase(updateCategory.fulfilled, (state, action) => {
    //   const { id, accountName, accountBalance } = action.payload;
    //   const existingAccount = state.items.find((account) => account.id === id);
    //   existingAccount.accountName = accountName;
    //   existingAccount.accountBalance = accountBalance;
    // });
  },
});

export const { updateActiveCategory, updateActiveSubcategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectAllCategories = (state) => state.categories.categories;
export const selectActiveCategory = (state) => state.categories.activeCategory;

export const selectSubcategories = (state) => state.categories.subcategories;
export const selectActiveSubcategory = (state) =>
  state.categories.activeSubcategory;
