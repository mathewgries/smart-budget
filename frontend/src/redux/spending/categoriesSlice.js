import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, put } from "../../api/spending/categories"

const initialState = {
  history: [],
  items: {},
  categories: [],
  subCategories: [],
  activeCategory: "",
  activeSubCategory: "",
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
      state.subCategories = state.items[state.activeCategory];
      state.activeSubCategory = state.subCategories[0];
    },
    updateActiveSubCategory(state, action) {
      state.history = { ...state, history: state.history };
      state.activeSubCategory = action.payload;
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
    addNewSubCategory(state, action) {
      state.history = { ...state, history: state.history };
      const subCategory = action.payload;
      state.subcategories.push(subCategory);
      state.activeSubCategory = subCategory;
      state.items = {
        ...state.items,
        [state.activeCategory]: [...state.subCategories],
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
        state.subCategories = state.items[state.activeCategory];
        state.activeSubCategory = state.subCategories[0];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(saveCategories.fulfilled, (state, action) => {
      
    });
  },
});

export const {
  updateActiveCategory,
  updateActiveSubCategory,
  addNewCategory,
  addNewSubCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectCategoryMap = (state) => state.categories.items;

export const selectAllCategories = (state) => state.categories.categories;
export const selectActiveCategory = (state) => state.categories.activeCategory;

export const selectSubCategories = (state) => state.categories.subCategories;
export const selectActiveSubCategory = (state) =>
  state.categories.activeSubCategory;
