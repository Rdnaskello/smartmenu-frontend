import React, { useState, useEffect } from "react";
import axios from "axios";
import { generateShoppingList } from "./ShoppingList";
import "./MenuPlanning.css"; // Додаємо CSS для стилізації

const API_MEALS = "http://127.0.0.1:8000/meals/";
const API_MENU = "http://127.0.0.1:8000/menu/";

function MenuPlanning({ setShoppingList }) { 
  const [meals, setMeals] = useState([]);
  const [menu, setMenu] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ date: "", meal_name: "", category: "", ingredients: "" });

  useEffect(() => {
    fetchMeals();
    fetchMenu();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(API_MEALS);
      setMeals(response.data);
    } catch (error) {
      console.error("Помилка завантаження страв:", error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get(API_MENU);
      const sortedMenu = response.data.sort((a, b) => new Date(a.date) - new Date(b.date)); 
      setMenu(sortedMenu);
    } catch (error) {
      console.error("Помилка завантаження меню:", error);
    }
  };

  const handleMealSelect = (event) => {
    const selectedMeal = meals.find(meal => meal.name === event.target.value);
    if (selectedMeal) {
      setNewMenuItem({
        ...newMenuItem,
        meal_name: selectedMeal.name,
        category: selectedMeal.category,
        ingredients: selectedMeal.ingredients
      });
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_MENU, newMenuItem);
      const updatedMenu = [...menu, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)); 
      setMenu(updatedMenu);
      setShoppingList(generateShoppingList(updatedMenu)); 
      setNewMenuItem({ date: "", meal_name: "", category: "", ingredients: "" });
    } catch (error) {
      console.error("Помилка додавання до меню:", error);
    }
  };

  const handleMenuDelete = async (id) => {
    try {
      await axios.delete(`${API_MENU}${id}`);
      const updatedMenu = menu.filter(item => item.id !== id);
      setMenu(updatedMenu);
      setShoppingList(generateShoppingList(updatedMenu)); 
    } catch (error) {
      console.error("Помилка видалення з меню:", error);
    }
  };

  return (
    <div className="menu-planning">
      <h2>📅 Планування меню</h2>
      <form onSubmit={handleMenuSubmit} className="menu-form">
        <input type="date" value={newMenuItem.date} onChange={(e) => setNewMenuItem({ ...newMenuItem, date: e.target.value })} required />
        <select onChange={handleMealSelect} value={newMenuItem.meal_name}>
          <option value="">Виберіть страву</option>
          {meals.map(meal => (
            <option key={meal.id} value={meal.name}>{meal.name}</option>
          ))}
        </select>
        <button type="submit" className="add-menu-btn">📌 Додати до меню</button>
      </form>

      <h2>📃 Заплановане меню</h2>
      <ul className="menu-list">
        {menu.map(item => (
          <li key={item.id} className="menu-item">
            <div className="menu-info">
              <strong>{item.meal_name}</strong> ({item.category})<br />
              📅 {item.date}
            </div>
            <button className="delete-btn" onClick={() => handleMenuDelete(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuPlanning;
