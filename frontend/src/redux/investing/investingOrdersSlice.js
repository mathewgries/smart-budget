import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
      SK: "INVESTING#ORDER#OPTION#96b33140-9ced-11ec-8432-b762c2373c01",
      id: "96b33140-9ced-11ec-8432-b762c2373c01",
      type: "INVESTING#ORDER#OPTION#",
      GSI1_PK: "ACCT#INVESTING#66941e00-a24c-11ec-b081-3776eb702261",
      ticker: "TSLA",
      openDatetime: 1646790271218,
      closeDatetime: 1646800271218,
      orderSide: "LONG",
      contractType: "CALL",
      strikePrice: "810",
      quantity: 1,
      openPrice: 22.0,
      closePrice: 28.2,
			result: "win",
			resultDollars: 620.00,
			resultPercent: 28.18
    },
    {
      PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
      SK: "INVESTING#ORDER#OPTION#86b33140-9ced-11ec-8432-b762c2373c01",
      id: "86b33140-9ced-11ec-8432-b762c2373c01",
      type: "INVESTING#ORDER#OPTION#",
      GSI1_PK: "ACCT#INVESTING#66941e00-a24c-11ec-b081-3776eb702261",
      ticker: "TSLA",
      openDatetime: 1646790271218,
      closeDatetime: 1646800271218,
      orderSide: "LONG",
      contractType: "CALL",
      strikePrice: "800",
      quantity: 1,
      openPrice: 20.0,
      closePrice: 18.0,
			result: "loss",
			resultDollars: 200,
			resultPercent: 10
    },
		{
      PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
      SK: "INVESTING#ORDER#OPTION#96b33140-9ced-11ec-8432-b762c2373c01",
      id: "96b33140-9ced-11ec-8432-b762c2373c01",
      type: "INVESTING#ORDER#OPTION#",
      GSI1_PK: "ACCT#INVESTING#66941e00-a24c-11ec-b081-3776eb702261",
      ticker: "TSLA",
      openDatetime: 1646790271218,
      closeDatetime: 1646800271218,
      orderSide: "LONG",
      contractType: "CALL",
      strikePrice: "810",
      quantity: 1,
      openPrice: 22.0,
      closePrice: 28.2,
			result: "win",
			resultDollars: 620.00,
			resultPercent: 28.18
    },
    {
      PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
      SK: "INVESTING#ORDER#OPTION#86b33140-9ced-11ec-8432-b762c2373c01",
      id: "86b33140-9ced-11ec-8432-b762c2373c01",
      type: "INVESTING#ORDER#OPTION#",
      GSI1_PK: "ACCT#INVESTING#66941e00-a24c-11ec-b081-3776eb702261",
      ticker: "TSLA",
      openDatetime: 1646790271218,
      closeDatetime: 1646800271218,
      orderSide: "LONG",
      contractType: "CALL",
      strikePrice: "800",
      quantity: 1,
      openPrice: 20.0,
      closePrice: 18.0,
			result: "loss",
			resultDollars: 200,
			resultPercent: 10
    },
		{
      PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
      SK: "INVESTING#ORDER#OPTION#96b33140-9ced-11ec-8432-b762c2373c01",
      id: "96b33140-9ced-11ec-8432-b762c2373c01",
      type: "INVESTING#ORDER#OPTION#",
      GSI1_PK: "ACCT#INVESTING#66941e00-a24c-11ec-b081-3776eb702261",
      ticker: "TSLA",
      openDatetime: 1646790271218,
      closeDatetime: 1646800271218,
      orderSide: "LONG",
      contractType: "CALL",
      strikePrice: "810",
      quantity: 1,
      openPrice: 22.0,
      closePrice: 28.2,
			result: "win",
			resultDollars: 620.00,
			resultPercent: 28.18
    },
    {
      PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
      SK: "INVESTING#ORDER#OPTION#86b33140-9ced-11ec-8432-b762c2373c01",
      id: "86b33140-9ced-11ec-8432-b762c2373c01",
      type: "INVESTING#ORDER#OPTION#",
      GSI1_PK: "ACCT#INVESTING#66941e00-a24c-11ec-b081-3776eb702261",
      ticker: "TSLA",
      openDatetime: 1646790271218,
      closeDatetime: 1646800271218,
      orderSide: "LONG",
      contractType: "CALL",
      strikePrice: "800",
      quantity: 1,
      openPrice: 20.0,
      closePrice: 18.0,
			result: "loss",
			resultDollars: 200,
			resultPercent: 10
    },
  ],
  status: "idle",
  error: null,
};

export const addNewInvestingOrder = createAsyncThunk(
	'investingOrders/addNewInvestingOrder',
	async (newOrder) => {
		console.log(newOrder)
	}
)

export const investingOrdersSlice = createSlice({
  name: "investingOrders",
  initialState,
  reducers: {},
	extraReducers(builder){
		builder.addCase(addNewInvestingOrder.fulfilled, (state, action) => {

		})
	}
});

export default investingOrdersSlice.reducer;

export const selectOrdersByAccountId = (state, accountId) =>
  state.investingOrders.items.filter(
    (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
  );