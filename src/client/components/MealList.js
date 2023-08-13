import React from "react";
import { useContext } from "react";

import { Link } from "react-router-dom";
import { MealsContext } from "./MealsContext";

import MealCard from "./MealCard";

function MealList() {
  const { meals } = useContext(MealsContext);

  return (
    <div className="container">
      {meals.map((meal) => {
        return (
          <MealCard key={meal.id}>
            <Link to={`/meals/${meal.id}`}>
              <div className="card-img"></div>
              <div className="card-info">
                <p className="text-title"> {meal.title}</p>
                <p className="text-body"> {meal.description}</p>
                <p className="text-body"> {meal.when_date}</p>
                <p className="text-title"> {meal.price} €</p>
                <p className="text-body"> GUESTS: {meal.max_reservations} </p>
                <p className="text-body">LOCATION: {meal.location}</p>
              </div>
            </Link>
          </MealCard>
        );
      })}
    </div>
  );
}
export default MealList;
