import logo from "../assets/logo.jpg";
import Footer from "../components/FooterContent";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();

  //  Step 1: Initial values for form
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // Step 2 : Validation schema using yup

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
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
        "https://password-reset-backend-iaah.onrender.com/api/user", //  backend URL
        values,
      );

      // Success message
      alert(response.data.message || "Signup successful!");

      // Reset form after success
      resetForm();

      //Navigate to login page
      navigate("/");
    } catch (error) {
      // Error message
      alert(error.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      // Stop loading
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 ">
      <img src={logo} alt="Personal Finance Manager Logo" className="mx-auto w-24 h-24" />
      <h1 className="text-3xl font-bold text-center font-serif">
        Create Your <span className="text-green-800">Personal Finance Manager</span> Account
      </h1>
      <p className="text-center mt-4 text-gray-600 text-lg font-semibold tracking-loose">
        Sign up to start managing your personal finances securely.
      </p>

      {/* Formik starts here */}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <div className="mt-2 max-w-xl mx-auto bg-white p-4 ">
            <Form>
              <div className="mb-4">
                {/* Name */}
                <label
                  htmlFor="name"
                  className="block font-semibold text-gray-800"
                >
                  Name
                </label>
                <Field
                  className="text-gray-600 border border-gray-300 w-full p-2 rounded mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Email */}
                <label className="block font-semibold text-gray-800  mt-4">
                  Email
                </label>

                <Field
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="text-gray-600 border border-gray-300 w-full p-2 rounded mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Password */}
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
                ></ErrorMessage>
                {/* Confirm Password */}
                <label
                  className="block font-semibold text-gray-800 mt-4"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500 text-white py-2 px-4 rounded mt-4 hover:bg-emerald-600 font-semibold  cursor-pointer"
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>

                <h1 className="text-center mt-4 text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="text-gray-800 font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
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

export default SignUp;
