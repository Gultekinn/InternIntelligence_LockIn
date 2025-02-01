import { register as firebaseRegister } from "../firebase";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Mail, Lock,User} from "lucide-react"; 
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Register() {
  const [darkMode, setDarkMode] = useState(false); 
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
    terms: Yup.boolean().oneOf([true], "You must accept the Terms of Use and Privacy Policy").required("You must accept the Terms and Conditions"),
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
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-200 via-pink-200 to-purple-200"
      } flex items-center justify-center min-h-screen transition-all duration-300 relative overflow-hidden`}
    >
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

      <div
        className={`${
          darkMode ? "bg-gray-800/80" : "bg-white"
        } p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 backdrop-blur-lg border border-gray-200 dark:border-gray-700`}
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)" }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <p className="text-center mb-8">Create a new account.</p>

        <Formik
          initialValues={{
            firstName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const { firstName, email, password } = values;

            try {
              const user = await firebaseRegister(email, password, firstName);
              if (user) {
                console.log("User created successfully:", user);
                navigate("/");
              }
            } catch (error) {
              if (error.code === "auth/email-already-in-use") {
                alert("This email is already in use.");
              } else {
                alert("An error occurred: " + error.message);
              }
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-6">
              <div className="relative">
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-300"
                  }`}
                />
               <User className="absolute top-3 left-3 text-gray-400" />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-300"
                  }`}
                />
                <Mail className="absolute top-3 left-3 text-gray-400" /> {/* Icon eklendi */}
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="relative">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-300"
                  }`}
                />
                <Lock className="absolute top-3 left-3 text-gray-400" /> {/* Icon eklendi */}
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="relative">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-300"
                  }`}
                />
                <Lock className="absolute top-3 left-3 text-gray-400" /> {/* Icon eklendi */}
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Field type="checkbox" name="terms" id="terms" className="h-4 w-4" />
                <label htmlFor="terms" className="text-sm">
                  I accept the{" "}
                  <a href="#" className="text-blue-500">
                    Terms of Use
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-blue-500">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={!values.terms}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Sign Up
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm mt-6">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
