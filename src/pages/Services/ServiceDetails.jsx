import React, { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import ReviewCard from "./ReviewCard";

const ServiceDetails = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const data = useLoaderData();
  const { name, price, _id, image, description } = data.data;

  console.log(reviews);
  const handleReview = (e) => {
    e.preventDefault();
    const message = e.target.message.value;

    const currentUser = {
      name,
      email: user?.email,
      image: user?.photoURL,
      message,
      serviceID: _id,
    };

    fetch("http://localhost:5000/review", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(currentUser),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        e.target.reset();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetch("http://localhost:5000/review")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setReviews(data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 my-16">
        <div className="card card-compact bg-base-100 shadow-2xl">
          <figure>
            <img className="w-full" src={image} alt="Shoes" />
          </figure>
          <div className="card-body mb-10">
            <h2 className="card-title text-2xl font-bold">{name}</h2>
            <p className="text-xl font-semibold">Price : ${price}</p>
            <p className="text-base">{description}</p>
          </div>
        </div>
        <div className="text-center justify-center items-center flex">
          {user?.email ? (
            <form onSubmit={handleReview} className="w-full">
              <div className="form-control">
                <label className="label">
                  <span className="text-xl">Your Review</span>
                </label>
                <textarea
                  name="message"
                  className="textarea textarea-bordered h-[100px] text-lg"
                  placeholder="Type Your Review"
                ></textarea>
              </div>
              <button className="btn w-full mt-5" type="submit">
                Post
              </button>
            </form>
          ) : (
            <div className="justify-center items-center">
              <h3 className="text-4xl">Please login to add a review</h3>
              <Link to="/login">
                <button className="btn btn-primary w-1/2 mt-10">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-4xl font-bold text-center mb-10">User Review</h3>
        <div className="grid grid-cols-3 gap-10">
          {reviews?.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
