import React from "react";
import email from "../assets/email.svg";
import Footer from "../components/FooterContent";
import { Link } from "react-router-dom";

function CheckEmail() {
  return (
    <div className="max-w-2xl mx-auto p-8 min-h-screen m-18">
      <img src={email} alt="" className="mx-auto w-24 h-24" />

      <h1 className="text-3xl font-bold text-center mt-4">Check Your Email</h1>
      <p className="text-center mt-4 text-gray-600">
        We've sent a password reset link to your email address.
      </p>
      <Link
        to="/"
        className=" block  w-full bg-emerald-500 text-white text-center py-2 px-4 rounded mt-4 hover:bg-emerald-600 font-semibold  cursor-pointer "
      >
        Back to Sign In
      </Link>

      <h1 className="text-center mt-4 text-gray-600 text-sm">
        Don't receive the email?{" "}
        <Link
          to="/forgot-password"
          className="text-gray-800 font-semibold hover:underline cursor-pointer"
        >
          Resend
        </Link>
      </h1>

      <Footer />
    </div>
  );
}

export default CheckEmail;
