import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import MealCard from "./MealCard";

function MainPage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetch("http://localhost:5000/api/meals?limit=5").then(
        (data) => data.json()
      );
      setMeals(data);
    })();
  }, []);

  return (
    <>
      <div className="container">
        {meals.map((meal) => {
          return (
            <MealCard key={meal.id}>
              <Link to={`/meals/${meal.id}`}>
                <div className="card-img"></div>
                <div className="card-info">
                  <p className="text-title"> TITLE: {meal.title}</p>
                  <p className="text-body"> DESCRIPTION: {meal.description}</p>
                  <p className="text-body"> DATE: {meal.when_date}</p>
                  <p className="text-title"> PRICE: {meal.price} €</p>
                  <p className="text-body">
                    NUMBER OF GUESTS: {meal.max_reservations}{" "}
                  </p>
                  <p className="text-title">LOCATION: {meal.location}</p>
                </div>
              </Link>
            </MealCard>
          );
        })}
        <Link className="links-style" to={"/meals"}>
          Show more meals...
        </Link>
      </div>
    </>
  );
}

export default MainPage;
