import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TestComponent from "./components/TestComponent/TestComponent";
import MealList from "./components/MealList";
import Meal from "./components/Meal";
import { MealsProvider } from "./components/MealsContext";
import MainPage from "./components/MainPage";

function App() {
  return (
    <Router>
      <MealsProvider>
        <Route exact path="/">
          <MainPage />
        </Route>

        <Route exact path="/meals">
          <MealList />
        </Route>
        <Route exact path="/meals/:id">
          <Meal />
        </Route>
      </MealsProvider>

      <Route exact path="/lol">
        <p>lol</p>
      </Route>
      <Route exact path="/test-component">
        <TestComponent></TestComponent>
      </Route>
    </Router>
  );
}

export default App;