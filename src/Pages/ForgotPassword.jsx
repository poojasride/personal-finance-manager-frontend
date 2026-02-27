import Logo from "../components/Logo";
import Footer from "../components/FooterContent";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  // Step 1 :  Initial values
  const initialValues = {
    email: "",
  };

  // Step 2 : Validation schema using yup

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  //  Step 3: What happens when form is submitted
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);

      // Start loading
      setSubmitting(true);

      // API call
      const response = await axios.post(
        `http://localhost:5000/api/auth/forgot-password`, //  backend URL
        values,
      );

      // Success message
      alert(response.data.message || "Password reset token sent to your email");

      // Reset form after success
      resetForm();

      //  Navigate to check email page
      navigate("/check-email");
    } catch (error) {
      // Error message
      alert(
        error.response?.data?.error ||
          "Failed to send reset email. Please try again.",
      );
    } finally {
      // Stop loading
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen  m-18">
      {/* <Logo /> */}
      <h1 className="text-3xl font-bold text-center ">Forgot Password </h1>
      <p className="text-center mt-4 text-gray-600">
        No worries! Enter your email address below and we'll
        <br />
        send you a link to reset your password.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <div className="mt-2 max-w-xl mx-auto bg-white p-4 ">
            <Form>
              <label className="block font-semibold text-gray-800">Email</label>

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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded mt-4 hover:bg-emerald-600 font-semibold  cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
            <Footer />
          </div>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPassword;
