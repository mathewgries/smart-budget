import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectVerticalSpreadsOrderById } from "../../../../redux/investing/investingOrdersSlice";
import { inputDateFormat } from "../../../../helpers/dateFormat";

export default function VerticalSpreadsOrder(props) {
  const { id } = useParams();
  const order = useSelector((state) =>
    selectVerticalSpreadsOrderById(state, id)
  );

  return (
    <div className="page-container">
      <div className="page-wrapper">{JSON.stringify(order, null, 2)}</div>
    </div>
  );
}
