import React from "react";
import { useContext, useState, useEffect } from "react";
import { MealsContext } from "./MealsContext";
import { Link, NavLink, useParams } from "react-router-dom";
import { AddReservation } from "./AddReservation";
import MealCard from "./MealCard";

export default function Meal() {
  const { id } = useParams();
  const { getMeal, isSuccess } = useContext(MealsContext);
  const [reservations, setReservations] = useState({});

  async function getReservations() {
    const response = await fetch(`api/meals/${id}/reservation`);
    const data = await response.json();
    return data;
  }
  useEffect(() => {
    getReservations().then((data) => {
      setReservations(data);
    });
  }, []);

  if (!isSuccess()) {
    return <h1>loading...</h1>;
  }

  const meal = getMeal(id);

  if (!meal) {
    return <NavLink to="/" />;
  }

  return (
    <>
      <div className="main">
        <MealCard key={meal.id}>
          <Link to={`/meals/${meal.id}`}>
            <div className="card-img"></div>
            <div className="card-info">
              <p className="text-title"> {meal.title}</p>
              <p className="text-body"> {meal.description}</p>
              <p className="text-body"> {meal.when_date}</p>
              <p className="text-title"> {meal.price} €</p>
              <p className="text-body">GUESTS: {meal.max_reservations} </p>
              <p className="text-body">LOCATION: {meal.location}</p>
            </div>
          </Link>
        </MealCard>

        <div
          style={{
            display:
              parseInt(reservations.total_guests) < meal.max_reservations
                ? "flex"
                : "none",
          }}
        >
          <AddReservation meal_id={meal.id} />
        </div>
      </div>
      <Link className="links-style" to="/meals">
        Back to meals list
      </Link>{" "}
    </>
  );
}
