import React, { useState } from "react";

import { useForm } from "react-hook-form";

export function AddReservation({ meal_id }) {
  const [reservation, setReservation] = useState({});

  const getTodayDate = () => {
    var date = new Date();

    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const added = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal_id: meal_id,
          contact_email: data.contact_email,
          contact_name: data.contact_name,
          contact_phonenumber: data.contact_phonenumber,
          number_of_guests: data.number_of_guests,
          created_date: getTodayDate(),
        }),
      });
      if (added.status === 200 && added.statusText === "OK") {
        alert("We have reserved place for You!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="login-container">
        <form className="login-header" onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            className="login-input"
            type="email"
            name="contact_email"
            {...register("contact_email")}
          />

          <label>Name</label>
          <input
            className="login-input"
            type="text"
            name="contact_name"
            {...register("contact_name")}
          />

          <label>Phone number:</label>
          <input
            className="login-input"
            type="text"
            name="contact_phonenumber"
            {...register("contact_phonenumber")}
          />

          <label>Number of guests:</label>
          <input
            className="login-input"
            type="number"
            name="number_of_guests"
            {...register("number_of_guests")}
          />

          <button className="login-button" type="submit">
            Book seat
          </button>
        </form>
      </div>
    </>
  );
}
