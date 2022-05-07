import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getCategoryChartDisplay,
  getOverallTotal,
  getMaxValue,
} from "./incomeGraphHelpers";
import { selectAllCategories } from "../../redux/spending/categoriesSlice";
import SubcategoriesChart from "./SubcategoriesChart";
import LoadingSpinner from "../../components/LoadingSpinner";

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
        {category.categoryName} <span>{percentOfWhole}%</span>
      </div>
      <div
        className="category-chart-item-bar"
        style={{ width: setWidth() }}
      >
				${item.total.toFixed(2)}
			</div>
    </div>
  );
};

export default function CategoriesChart(props) {
  const { transactions, timeFrame } = props;
  const categories = useSelector(selectAllCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState();
  const [overallTotal, setOverallTotal] = useState();
  const [max, setMax] = useState();

  useEffect(() => {
    const sorted = getCategoryChartDisplay(transactions, timeFrame).sort(
      (a, b) => b.total - a.total
    );
    const overallTotal = getOverallTotal(transactions, timeFrame);
    const max = getMaxValue(sorted.map((n) => n.total));
    setMax(max);
    setSortedCategories(sorted);
    setActiveCategory(sorted[0]);
    setOverallTotal(overallTotal);
    setIsLoading(false);
  }, [timeFrame, transactions]);

  function toggleActive(category) {
    setActiveCategory(category);
  }

  return (
    <div className="categories-chart-container">
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
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <SubcategoriesChart
            activeCategory={activeCategory}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}