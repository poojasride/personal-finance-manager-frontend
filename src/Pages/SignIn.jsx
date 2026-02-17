import React from "react";
import Logo from "../components/Logo";
import Footer from "../components/FooterContent";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";

function Signin() {
  const navigate = useNavigate();

  // Step 1 : Initial Values
  const initialValues = {
    email: "",
    password: "",
  };

  // Step 2 : Validation schema using yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(1, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);

      //Start loading
      setSubmitting(true);

      //API call
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        values,
      );

      //Success message
      alert(response.data.message || "Signin successfull!");

      //Reset form after success
      resetForm();

      //Navigate welcome page
      navigate("/welcome");
    } catch (error) {
      //Error message
      alert(
        error.response?.data?.message || "Signin failed. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 ">
      <Logo />
      <h1 className="text-3xl font-bold text-center font-serif">
        Welcome to <span className="text-green-800">E-Mart</span>
      </h1>
      <p className="text-center mt-4 text-gray-600 text-lg font-semibold tracking-loose">
        Please sign in to your account to continue shopping with Love!
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <div className="mt-2 max-w-xl mx-auto bg-white p-4 ">
            <Form action="">
              <div className="mb-4">
                <label
                  className="block font-semibold text-gray-800"
                  htmlFor="email"
                >
                  Email
                </label>
                <Field
                  className="text-gray-600 border border-gray-300 w-full p-2 rounded mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <label
                  className="block font-semibold text-gray-800 mt-4"
                  htmlFor="password"
                >
                  Password
                </label>
                <Field
                  className="text-gray-600 border border-gray-300 w-full p-2 rounded mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />

                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <div className="flex mt-4 cursor-pointer">
                  {/* Left side */}
                  <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600 ">Remember me</span>
                  </label>

                  {/* Right side */}
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm text-gray-800 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-2 px-4 rounded mt-4 hover:bg-gray-800 font-semibold  cursor-pointer"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>

                <h1 className="text-center mt-4 text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-gray-800 font-semibold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </h1>

                <Footer />
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default Signin;
