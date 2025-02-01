import { useEffect, useState } from "react";
import { passwordResetEmail } from "../firebase"; // Import the reset function
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Moon, Sun, Mail } from "lucide-react"; // Added Mail icon

export default function ForgotPassword() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-blue-200 via-pink-200 to-purple-200"
      } flex items-center justify-center min-h-screen transition-all duration-300 relative`}
    >
      {/* Background Blurs */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 top-10 left-10 ${
          darkMode ? "bg-purple-500" : "bg-blue-300"
        }`}
      ></div>
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 bottom-10 right-10 ${
          darkMode ? "bg-orange-500" : "bg-pink-300"
        }`}
      ></div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 bg-gray-300 dark:bg-gray-700 rounded-full shadow-lg z-10"
      >
        {darkMode ? (
          <Sun className="text-yellow-500" />
        ) : (
          <Moon className="text-gray-900" />
        )}
      </button>

      {/* Form Container */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 backdrop-blur-lg`}
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)" }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
        <p className="text-center mb-6">Please enter your email to reset your password!</p>

        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const { email } = values;

            try {
              await passwordResetEmail(email); // Call the password reset function
              navigate("/login"); // Redirect to login after sending the reset email
            } catch (error) {
              toast.error(error.message); // Handle errors
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-4">
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-300"
                  }`}
                />
                <Mail className="absolute top-3 left-3 text-gray-400" /> {/* Icon added */}
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!values.email}
                 className="w-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Send Reset Link
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
