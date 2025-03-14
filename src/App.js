import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AvailableMeals from "./components/AvailableMeals";
import MenuPlanning from "./components/MenuPlanning";
import ShoppingList from "./components/ShoppingList";
import "./App.css"; // Підключаємо оновлений CSS

function App() {
  const [shoppingList, setShoppingList] = useState({});

  return (
    <Router>
      <div className="App">
        {/* Верхня навігаційна панель */}
        <header>
          <div className="logo">🍽️ SmartMenu</div>
          <nav>
            <Link to="/">dishes</Link> |{" "}
            <Link to="/menu-planning">menu planning</Link> |{" "}
            <Link to="/shopping-list">shopping list</Link>
          </nav>
        </header>

        {/* Основний контейнер */}
        <div className="container">
          <Routes>
            <Route path="/" element={<AvailableMeals />} />
            <Route path="/menu-planning" element={<MenuPlanning setShoppingList={setShoppingList} />} />
            <Route path="/shopping-list" element={<ShoppingList shoppingList={shoppingList} setShoppingList={setShoppingList} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
