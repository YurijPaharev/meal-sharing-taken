const express = require("express");
const router = express.Router();
const knex = require("../database");
//All reviews   
router.get("/", async(request, response) => {
    try {
        // knex syntax for selecting things. Look up the documentation for knex for further info
        const titles = await knex("reviews");
        response.json(titles);
    } catch (error) {
        throw error;
    }
});

//Returns reviews for a specific meal
router.get("/meals/:meal_id/reviews", async(request, response) => {
    try {
    

       const specificMeal=request.params.meal_id;
       const results= await knex.select('reviews.*','meal.title as mealTitle')
       .from('reviews','meal')
       .innerJoin('meal',"reviews.meal_id","=","meal.id")
       .having("reviews.meal_id","=",specificMeal)
        
       response.json(results);
      

    } catch (error) {
        throw error;
    }
});

//Adds a new review 	
router.post("/", async (request, response) => {
    try {
          const newReview = await knex("reviews").insert(request.body);
      response.send("New review added");
    } catch (error) {
      throw error;
    }
  });
  //Returns review by id
  router.get("/:id", async (request, response) => {
    try {
      const reviews = await knex("reviews").where("id", parseInt(request.params.id));
      response.json(reviews);
    } catch (error) {
      throw error;
    }
  });
  //Updates the review by id	
  router.put("/:id", async (request, response) => {
    try {
        const reviews = await knex("reviews")
        .where("id", parseInt(request.params.id))
        .update(request.body);
      response.json(reviews);
    } catch (error) {
      throw error;
    }
  });
//Deletes the review by id
router.delete("/:id", async (request, response) => {
    try {
      const deleteReview = await knex("reviews")
        .where("id", parseInt(request.params.id))
        .del();
      response.json(deleteReview);
    } catch (error) {
      throw error;
    }
  });

module.exports = router;