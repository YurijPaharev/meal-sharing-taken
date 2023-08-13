import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export async function getMeals() {
  const response = await fetch("api/meals");
  const data = await response.json();

  return data;
}

export const MealsContext = createContext();

export function MealsProvider({ children }) {
  const [meals, setMeals] = useState([]);
  const [requestState, setRequestState] = useState("loading");

  useEffect(() => {
    getMeals().then((data) => {
      setMeals(data);
      setRequestState("success");
    });
  }, []);

  console.log("home route");

  const getMeal = (mealId) => {
    if (!meals) return undefined;
    return meals.find((meal) => meal.id === Number(mealId));
  };

  const isSuccess = () => {
    return requestState === "success";
  };

  return (
    <MealsContext.Provider value={{ meals, getMeal, isSuccess }}>
      {children}
    </MealsContext.Provider>
  );
}
