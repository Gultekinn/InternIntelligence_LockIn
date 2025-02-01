import { useEffect, useState } from "react";
import { login as firebaseLogin } from "../firebase";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Sun, Moon, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-200 via-pink-200 to-purple-200"
      } flex items-center justify-center min-h-screen transition-all duration-300 relative overflow-hidden`}
    >
  
      {/* Background Blurs */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 top-10 left-10 ${
          darkMode ? "bg-purple-500" : "bg-teal-300"
        }`}
      ></div>
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 bottom-10 right-10 ${
          darkMode ? "bg-orange-500" : "bg-pink-300"
        }`}
      ></div>

      {/* Dark Mode Toggle */}
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

      {/* Login Card */}
      <div
        className={`${
          darkMode ? "bg-gray-800/80" : "bg-white"
        } p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 backdrop-blur-lg border border-gray-200 dark:border-gray-700`}
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)" }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
        <p className="text-center mb-8">Welcome back! Please login to your account.</p>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const { email, password } = values;

            try {
              const user = await firebaseLogin(email, password);
              if (user) {
                const userData = {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                };

                dispatch(login(userData));
                navigate("/");
              }
            } catch (error) {
              if (error.code === "auth/user-not-found") {
                alert("No user found with this email. Please sign up.");
              } else if (error.code === "auth/wrong-password") {
                alert("Incorrect password. Please try again.");
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
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-300"
                  }`}
                />
                <Mail className="absolute top-3 left-3 text-gray-400" />
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
                <Lock className="absolute top-3 left-3 text-gray-400" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!values.email || !values.password}
                 className="w-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Sign In
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-center text-sm mt-2">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </p>

        {user && <div className="mt-4 text-center">User logged in: {user.email}</div>}
      </div>
    </div>
  );
}
