import React from "react";
import Logo from "../components/Logo";
import Footer from "../components/FooterContent";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function CreateNewPassword() {
  // Get token from URL
  const { token } = useParams();
  const navigate = useNavigate();

  //  Step 1: Initial values for form
  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  // Step 2 : Validation schema using yup

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(1, "Password must be at least 6 characters")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("confirmPassword is required"),
  });

  //  Step 3: What happens when form is submitted
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);

      // Start loading
      setSubmitting(true);

      // API call
      const response = await axios.post(
        `http://localhost:3000/api/auth/reset-password/${token}`, //  backend URL
        values,
      );

      // Success message
      alert(response.data.message || "Password reset successful!");

      // Reset form after success
      resetForm();

      //  Navigate to signin page
      navigate("/");
    } catch (error) {
      // Error message
      alert(
        error.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
    } finally {
      // Stop loading
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen">
      <Logo />
      <h1 className="text-3xl font-bold text-center ">Create New Password </h1>
      <p className="text-center mt-4 text-gray-600">
        Enter your email address below to complete the reset
        <br /> process. Ensure your new password is strong.
      </p>

      {/* Formik starts here */}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <div className="mt-2 max-w-xl mx-auto bg-white p-4 ">
            <Form action="">
              <label
                className="block font-semibold text-gray-800 mt-4"
                htmlFor="password"
              >
                New Password
              </label>

              <Field
                className="text-gray-600 border border-gray-300 w-full p-2 rounded mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                name="newPassword"
                type="password"
                placeholder="Enter your password"
              />

              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm"
              ></ErrorMessage>

              <label
                className="block font-semibold text-gray-800 mt-4"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>

              <Field
                className="text-gray-600 border border-gray-300 w-full p-2 rounded mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
              />

              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              ></ErrorMessage>

              <button
                className="w-full bg-black text-white py-2 px-4 rounded mt-4 hover:bg-gray-800 font-semibold  cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting ..." : " Reset Password"}
              </button>
            </Form>

            <Footer />
          </div>
        )}
      </Formik>
    </div>
  );
}

export default CreateNewPassword;
