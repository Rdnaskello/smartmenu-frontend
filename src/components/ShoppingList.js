import React, { useState, useEffect } from "react";
import "./ShoppingList.css"; // Підключаємо окремий файл стилів

const ShoppingList = ({ shoppingList, setShoppingList }) => {
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("shoppingList")) || {};
    setShoppingList(savedList);
  }, []);

  const saveShoppingList = (updatedList) => {
    localStorage.setItem("shoppingList", JSON.stringify(updatedList));
    setShoppingList(updatedList);
  };

  const toggleItem = (item) => {
    const updatedList = { ...shoppingList, [item]: !shoppingList[item] };
    saveShoppingList(updatedList);
  };

  return (
    <div className="shopping-list-container">
      <h2>🛒 Список покупок</h2>
      <ul className="shopping-list">
        {Object.keys(shoppingList).map((item) => (
          <li key={item} className="shopping-item">
            <span className={shoppingList[item] ? "checked-item" : ""}>
              {item}
            </span>
            <input
              type="checkbox"
              checked={shoppingList[item] || false}
              onChange={() => toggleItem(item)}
              className="shopping-checkbox"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

// ✅ Функція для генерації списку покупок
export const generateShoppingList = (menu) => {
  const ingredients = {};
  menu.forEach(item => {
    item.ingredients.split(/,\s*/).forEach(ingredient => {
      ingredients[ingredient] = false;
    });
  });

  localStorage.setItem("shoppingList", JSON.stringify(ingredients));
  return ingredients;
};

export default ShoppingList;
