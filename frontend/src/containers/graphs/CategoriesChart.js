import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
	reduceCategories,
  getOverallTotal,
  getMaxValue,
} from "./incomeGraphHelpers";
import { selectAllCategories } from "../../redux/spending/categoriesSlice";
import SubcategoriesChart from "./SubcategoriesChart";

const CategoryChartItem = (props) => {
  const { item, categories, overallTotal, max } = props;
  const category = categories.find(
    (category) => category.id === item.categoryId
  );
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
        {category.categoryName}: ${item.total.toFixed(2)} ({percentOfWhole}%)
      </div>
      <div
        className="category-chart-item-bar"
        style={{ width: setWidth() }}
      ></div>
    </div>
  );
};

export default function CategoriesChart(props) {
  const { transactions, timeFrame } = props;
  const categories = useSelector(selectAllCategories);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [overallTotal, setOverallTotal] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    const sorted = reduceCategories(transactions).sort(
      (a, b) => b.total - a.total
    );
    const overallTotal = getOverallTotal(transactions, timeFrame);
    const max = getMaxValue(sorted.map((n) => n.total));

    if (sorted) {
      setMax(max);
      setSortedCategories(sorted);
      setActiveCategory(sorted[0]);
      setOverallTotal(overallTotal);
    }
  }, [timeFrame, transactions]);

  function toggleActive(category) {
    setActiveCategory(category);
  }

  return (
    <div className="categories-chart-container">
      {activeCategory && (
        <>
          <div className="categories-chart-wrapper">
            {sortedCategories.map((sorted) => (
              <div key={sorted.categoryId} onClick={() => toggleActive(sorted)}>
                <CategoryChartItem
                  item={sorted}
                  overallTotal={overallTotal}
                  max={max}
                  categories={categories}
                />
              </div>
            ))}
          </div>
          <div className="categories-chart-wrapper">
            <SubcategoriesChart
              activeCategory={activeCategory}
              categories={categories}
            />
          </div>
        </>
      )}
    </div>
  );
}
