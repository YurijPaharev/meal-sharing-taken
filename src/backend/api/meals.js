const express = require("express");
const router = express.Router();
const knex = require("../database");

const postman = require("postman");
const { json } = require("body-parser");
const { max } = require("../database");

router.get("/", async (request, response) => {
	/*const maxPrice = request.query.maxPrice;
  const title = request.query.title;
  const dateAfter = request.query.dateAfter;
  const dateBefore = request.query.dateBefore;
  const sortKey = request.query.sortKey;
  const sortDir = request.query.sortDir;
  const limit=request.query.limit;*/

	const { maxPrice, title, dateAfter, dateBefore, sortKey, sortDir, limit } =
		request.query;

	try {
		let mealsQuery = knex("meals");
		if (
			!maxPrice &&
			!title &&
			!dateAfter &&
			!dateBefore &&
			!sortKey &&
			!sortDir &&
			!limit
		)
			mealsQuery = mealsQuery.select("*");
		/* if (maxPrice&&limit) {
      const temprice = parseFloat(maxPrice);
      const templimit=parseInt(limit);
      const meals = await knex("meal").where("price", "<=", temprice).limit(parseInt(limit));
     
      response.send(meals);
    }*/

		/*
    router.get('/search', async (req, res) => {
      const { name, phone } = req.query;
    
      if(!name && !phone)
        return res.status(400).send('Please provide a search param');
    
      try {
        let contactsQuery = db('contacts');
    
        if(name)
          contactsQuery = contactsQuery.where('name', 'like', `%${name}%`);
    
        if(phone)
          contactsQuery = contactsQuery.where('phone', 'like', `%${phone}%`);
    
        console.log(contactsQuery.toString());
    
        const contacts = await contactsQuery;
        res.json(contacts);
      } catch (error) {
        res.status(500).send(error.message);
      }
    })
    */
		if (maxPrice) {
			mealsQuery = mealsQuery.where("price", "<=", maxPrice);
		}
		if (title) {
			mealsQuery = mealsQuery.where("title", "like", `%${title}%`);
		}
		if (dateAfter) {
			const newDate = new Date(dateAfter);
			mealsQuery = mealsQuery.where("when_date", ">", dateAfter);
		}
		if (dateBefore) {
			const newDate = new Date(dateBefore);
			mealsQuery = mealsQuery.where("when_date", "<", dateBefore);
		}

		if (limit) {
			mealsQuery = mealsQuery.limit(parseInt(limit));
		}
		if (sortKey === "price" && sortDir === "asc") {
			mealsQuery = mealsQuery.orderBy("price", " asc");
		}
		if (sortKey === "price" && sortDir === "desc") {
			mealsQuery = mealsQuery.orderBy("price", "desc");
		}
		if (sortKey === "max_reservations" && sortDir === "asc") {
			mealsQuery = mealsQuery.select("*").orderBy("max_reservations", "asc");
		}
		if (sortKey === "max_reservations" && sortDir === "desc") {
			mealsQuery = mealsQuery.select("*").orderBy("max_reservations", "desc");
		}

		console.log(mealsQuery.toString());

		const meals = await mealsQuery;
		response.json(meals);
	} catch (error) {
		response.status(500).send(error.message);
	}
});

router.get("/future-meals", async (request, response) => {
	try {
		const titles = await knex.raw(
			"SELECT title,when_date FROM meals WHERE when_date>=NOW()"
		);
		response.header("Content-Type", "application/json");
		response.send(JSON.stringify(titles, null, 2));
	} catch (error) {
		throw error;
	}
});

router.get("/past-meals", async (request, response) => {
	try {
		const titles = await knex.raw(
			"SELECT title,when_date FROM meals WHERE when_date<=NOW()"
		);
		response.json(titles);
	} catch (error) {
		throw error;
	}
});

router.get("/all-meals", async (request, response) => {
	try {
		const titles = await knex.raw("SELECT title,id FROM meals ORDER BY id ASC");
		response.json(titles);
	} catch (error) {
		throw error;
	}
});

router.get("/first-meal", async (request, response) => {
	try {
		const [titles] = await knex.raw("select * from meals order by id LIMIT 1");
		if (titles.length === 0) {
			response.status(404).send("There are no available meals");
		}
		// "SELECT id,title,when_date FROM meal WHERE SELECT MIN(id) FROM meal"

		//if (JSON.stringify(titles).length === 0) {
		//if(JSON.stringify(titles)===[[],{}])
		//response.send("<h1>404 Error, there are no meals</h1>");
		//}
		else {
			response.json(titles);
		}
	} catch (error) {
		throw error;
	}
});

/*router.get("/last-meal", async (request, response) => {
  try {
    const [titles] = await knex.raw("select * from meal ORDER BY id DESC LIMIT 1");
      //"SELECT id,title,when_date FROM meal WHERE id = (SELECT MAX(id) FROM meal);" ("id=").select("MAX(id)").from("meal")
      if(titles.length===0){

        response.status(404).send("There are no available meals");
      }
      myObject=Object.assign(titles);
      response.json(myObject);
  } catch (error) {
    throw error;
  }
});*/

router.get("/last-meal", async (request, response) => {
	try {
		const [titles] = await knex.raw(
			"select * from meals ORDER BY id DESC LIMIT 1"
		);
		//"SELECT id,title,when_date FROM meal WHERE id = (SELECT MAX(id) FROM meal);" ("id=").select("MAX(id)").from("meal")
		if (titles.length === 0) {
			response.status(404).send("There are no available meals");
		}

		const newObject = Object.assign({}, titles);
		response.json(newObject);
	} catch (error) {
		throw error;
	}
});

/*
router.post("/", async (request, response) => {
  try {
    const newMeal = await knex("meal").insert({
      id:1,
      created_date: new Date(),
      when_date: "2023-3-03 12:00:00",
      title: "Title7",
      descrip: "Somedescription7",
      loc: "Odense",
      price: 230,
      max_reservations: 20,
    });
    response.json(newMeal);
  } catch (error) {
    throw error;
  }
});*/

//let current_timestamp = new Date();
//postman.environment.set("current_timestamp", current_timestamp.toISOString());

router.post("/", async (request, response) => {
	try {
		const newtitle = request.body.title;
		const date = request.body.date;
		const newMeal = await knex("meals").insert({
			title: newtitle,
			created_date: date,
			when_date: date,
			descrip: "Somedescription10",
			loc: "Odense",
			price: 230,
			max_reservations: 20,
		});
		response.sendStatus(201);
	} catch (error) {
		throw error;
	}
});

router.get("/:id", async (request, response) => {
	const id = request.params.id;
	try {
		const [idMeal] = await knex("meals").select("*").where({ id });
		if (!idMeal) {
			response.sendStatus(404);
		} else {
			response.json(idMeal);
		}
	} catch (error) {
		throw error;
	}
});

/*
router.get("/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const token = request.headers.authorization;

    if (token==='xyz') {
    const [snippets] = await knex("snippets").where({ id });
    if (!snippets) {
      return response.send(404).send("The snippet with given ID not found");
    }

    response.send(snippets);}
    else{
        return response.sendStatus(403);
    }
  } catch (error) {
    throw error;
  }
});
*/
router.put("/:id", async (request, response) => {
	const id = request.params.id;
	try {
		const idMeal = await knex("meals").where({ id }).update({ title: "TITLE" });

		if (!idMeal) {
			return response.send("Updated");
		} else {
			response.sendStatus(201);
		}
	} catch (error) {
		throw error;
	}
});

router.delete("/:id", async (request, response) => {
	const id = request.params.id;
	try {
		const idMeal = await knex("meals").where({ id }).del();

		if (!idMeal) {
			return response.sendStatus(404);
		} else {
			response.send("Deleted");
		}
	} catch (error) {
		throw error;
	}
});

router.get('/:id/reservation', async (req, res) => {
    const id = req.params.id;
    try {
        const totalGuests = await knex('meals')
            .leftJoin('reservations', 'meals.id', '=', 'reservations.meal_id')
            .select(knex.raw('COALESCE(SUM(reservations.number_of_guests),0) as total_guests'))
          	.where('meals.id', id)
            .groupBy('meals.id');
        res.json(totalGuests[0]);
    } catch (error) {
        throw error;
    }
});

module.exports = router;