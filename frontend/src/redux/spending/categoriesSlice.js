import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, put } from "../../api/spending/categories";
import { addNewUser, fetchAllData } from "../users/usersSlice";

const initialState = {
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
      state.activeCategory = action.payload;
      state.subCategories = state.items[state.activeCategory];
      state.activeSubCategory = state.subCategories[0];
    },
    updateActiveSubCategory(state, action) {
      state.activeSubCategory = action.payload;
    },
    addNewCategory(state, action) {
      const category = action.payload;
      state.items = {
        ...state.items,
        [category]: [],
      };
      state.categories.push(category);
      state.activeCategory = category;
      state.subCategories = state.items[state.activeCategory];
      state.activeSubCategory = state.subCategories[0];
    },
    addNewSubCategory(state, action) {
      const subCategory = action.payload;
      state.subCategories.push(subCategory);
      state.activeSubCategory = subCategory;
      state.items = {
        ...state.items,
        [state.activeCategory]: [...state.subCategories],
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addNewUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const data = action.payload.find(
          (item) => item.Put.Item.type === "CATEGORY"
        );
        const categories = data.Put.Item;
        const { categoryMap } = categories;
        state.items = categoryMap;
        state.categories = Object.keys(categoryMap);
        state.activeCategory = state.categories[0];
        state.subCategories = state.items[state.activeCategory];
        state.activeSubCategory = state.subCategories[0];
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
          (item) => item.type === "CATEGORY"
        );
        const { categoryMap } = categories[0];
        state.items = categoryMap;
        state.categories = Object.keys(categoryMap);
        state.activeCategory = state.categories[0];
        state.subCategories = state.items[state.activeCategory];
        state.activeSubCategory = state.subCategories[0];
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
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
    builder.addCase(saveCategories.fulfilled, (state, action) => {});
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
