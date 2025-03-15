import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AvailableMeals.css"; // Додаємо CSS для стилізації

// API для страв
const API_MEALS = process.env.REACT_APP_API_URL + "/meals";

// Категорії страв
const mealCategories = [
  "Всі категорії", "Сніданок", "Гарячі страви", "Суп", "Салат",
  "Десерти", "Фастфуд", "Інше", "Перекус"
];

function AvailableMeals() {
  const [meals, setMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Всі категорії");
  const [newMeal, setNewMeal] = useState({ name: "", category: "", ingredients: "" });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(API_MEALS);
      setMeals(response.data);
    } catch (error) {
      console.error("Помилка завантаження страв:", error);
    }
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_MEALS, newMeal);
      setMeals([...meals, response.data]);
      setNewMeal({ name: "", category: "", ingredients: "" });
    } catch (error) {
      console.error("Помилка додавання страви:", error);
    }
  };

  const handleMealDelete = async (id) => {
    try {
      await axios.delete(`${API_MEALS}${id}`);
      setMeals(meals.filter(meal => meal.id !== id));
    } catch (error) {
      console.error("Помилка видалення страви:", error);
    }
  };

  return (
    <div className="available-meals">
      <div className="meals-container">
        {/* Форма додавання страви */}
        <div className="add-meal">
          <h3>➕ Додати страву</h3>
          <form onSubmit={handleMealSubmit}>
            <input
              type="text"
              placeholder="Назва"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              required
            />
            <select
              value={newMeal.category}
              onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })}
              required
            >
              <option value="">Оберіть категорію</option>
              {mealCategories.slice(1).map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Інгредієнти"
              value={newMeal.ingredients}
              onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value })}
              required
            />
            <button type="submit" className="add-btn">✅ Додати</button>
          </form>
        </div>

        {/* Фільтр за категоріями */}
        <div className="meals-list">
          <h3>📂 Фільтр</h3>
          <select className="category-filter" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {mealCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>

          {/* Відображення списку страв */}
          <ul className="meal-items">
            {meals
              .filter(meal => selectedCategory === "Всі категорії" || meal.category === selectedCategory)
              .map(meal => (
                <li key={meal.id} className="meal-card">
                  <div className="meal-info">
                    <strong>{meal.name}</strong> ({meal.category})<br />
                    <span className="meal-ingredients">Інгредієнти: {meal.ingredients}</span>
                  </div>
                  <button className="delete-btn" onClick={() => handleMealDelete(meal.id)}>❌</button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AvailableMeals;
