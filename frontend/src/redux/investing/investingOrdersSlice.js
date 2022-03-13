import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  items: {
    options: [
      {
        PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
        SK: "INVESTING#ORDER#OPTION#96b33140-9ced-11ec-8432-b762c2373c01",
        id: "96b33140-9ced-11ec-8432-b762c2373c01",
        type: "INVESTING#ORDER#OPTION#",
        GSI1_PK: "ACCT#INVESTING#76b33140-9ced-11ec-8432-b762c2373c01",
        ticker: "TSLA",
        openDatetime: 1646790271218,
        closeDatetime: 1646800271218,
        openOrderType: "BUY",
        closeOrderType: "SELL",
        contractType: "CALL",
        strikePrice: "810",
        quantity: 1,
        openPrice: 2200.0,
        closePrice: 2820.0,
        customFieldMap: {
          expirationDate: 1647000271218,
          daysToExpiration: 3,
          deltaAtOpen: 0.49,
          deltaAtClose: 0.72,
          thetaAtOpen: 4.27,
          thetaAtClose: 3.58,
        },
      },
      {
        PK: "USER#us-east-1:9cd038af-168a-4a1f-90a1-f00c70c8ab86",
        SK: "INVESTING#ORDER#OPTION#86b33140-9ced-11ec-8432-b762c2373c01",
        id: "86b33140-9ced-11ec-8432-b762c2373c01",
        type: "INVESTING#ORDER#OPTION#",
        GSI1_PK: "ACCT#INVESTING#76b33140-9ced-11ec-8432-b762c2373c01",
        ticker: "TSLA",
        openDatetime: 1646790271218,
        closeDatetime: 1646800271218,
        openOrderType: "BUY",
        closeOrderType: "SELL",
        contractType: "CALL",
        strikePrice: "800",
        quantity: 1,
        openPrice: 2000.0,
        closePrice: 2500.0,
        customFieldMap: {
          expirationDate: 1647000271218,
          daysToExpiration: 3,
          deltaAtOpen: 0.56,
          deltaAtClose: 0.65,
          thetaAtOpen: 3.55,
          thetaAtClose: 3.23,
        },
      },
    ],
    spreads: [],
    shares: [],
  },
  status: "idle",
  error: null,
};

export const investingOrdersSlice = createSlice({
  name: "investingOrders",
  initialState,
  reducers: {},
});

export default investingOrdersSlice.reducer;
