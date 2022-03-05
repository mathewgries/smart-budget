import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, put } from "../api/categories";

const initialState = {
  history: [],
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

export const saveCategories = createAsyncThunk(
  "categories/saveCategories",
  async (categoryMap) => {
    return await put(categoryMap);
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    updateActiveCategory(state, action) {
      state.history = { ...state, history: state.history };
      state.activeCategory = action.payload;
      state.subcategories = state.items[state.activeCategory];
      state.activeSubcategory = state.subcategories[0];
    },
    updateActiveSubcategory(state, action) {
      state.history = { ...state, history: state.history };
      state.activeSubcategory = action.payload;
    },
    addNewCategory(state, action) {
      state.history = { ...state, history: state.history };
      const category = action.payload;
      state.items = {
        ...state.items,
        [category]: [],
      };
      state.categories.push(category);
      state.activeCategory = category;
    },
    addNewSubcategory(state, action) {
      state.history = { ...state, history: state.history };
      const subcategory = action.payload;
      state.subcategories.push(subcategory);
      state.activeSubcategory = subcategory;
      state.items = {
        ...state.items,
        [state.activeCategory]: [...state.subcategories],
      };
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
    builder.addCase(saveCategories.fulfilled, (state, action) => {
      console.log(action);
    });
  },
});

export const {
  updateActiveCategory,
  updateActiveSubcategory,
  addNewCategory,
  addNewSubcategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectCategoryMap = (state) => state.categories.items;

export const selectAllCategories = (state) => state.categories.categories;
export const selectActiveCategory = (state) => state.categories.activeCategory;

export const selectSubcategories = (state) => state.categories.subcategories;
export const selectActiveSubcategory = (state) =>
  state.categories.activeSubcategory;
