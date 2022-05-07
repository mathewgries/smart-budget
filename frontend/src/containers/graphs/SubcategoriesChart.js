import React, { useState, useEffect } from "react";
import { getMaxValue } from "./incomeGraphHelpers";

const SubcategoryChartItem = (props) => {
  const { item, overallTotal, max } = props;
  const [percentOfWhole, setPercentOfWhole] = useState();

  useEffect(() => {
    const percent = (item.total / overallTotal) * 100;
    setPercentOfWhole(percent.toFixed(2));
  }, [item, overallTotal]);

  function setWidth() {
    if (item.total === max) {
      return "100%";
    } else {
      return ((item.total / max) * 100).toString() + "%";
    }
  }

  return (
    <div className="category-chart-item">
      <div className="category-chart-item-name">
        {item.name}: ${item.total.toFixed(2)} ({percentOfWhole}%)
      </div>
      <div
        className="category-chart-item-bar"
        style={{ width: setWidth() }}
      ></div>
    </div>
  );
};

export default function SubcategoriesChart(props) {
  const { activeCategory, categories } = props;
  const [sortedSubcategories, setSortedCategories] = useState([]);
  const [overallTotal, setOverallTotal] = useState();
  const [max, setMax] = useState();

  useEffect(() => {
    const subcategories = categories.find(
      (category) => activeCategory.categoryId === category.id
    ).subcategories;
    const sorted = activeCategory.subcategories
      .map((active) => ({
        ...active,
        name: subcategories.find(
          (subcategory) => active.subcategoryId === subcategory.id
        ).name,
      }))
      .sort((a, b) => b.total - a.total);
    const max = getMaxValue(sorted.map((n) => n.total));

    setMax(max);
    setSortedCategories(sorted);
    setOverallTotal(activeCategory.total);
  }, [activeCategory, categories]);

  return (
    <div>
      {sortedSubcategories.map((sorted) => (
        <div key={sorted.subcategoryId}>
          <SubcategoryChartItem
            item={sorted}
            overallTotal={overallTotal}
            max={max}
          />
        </div>
      ))}
    </div>
  );
}
