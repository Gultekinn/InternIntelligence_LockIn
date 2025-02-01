import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../firebase";
import { logout as logoutHandle } from "../store/auth";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    dispatch(logoutHandle());
    navigate("/login", { replace: true });
  };

  const handleEditClick = () => {
    navigate("/edit");
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-blue-200 via-pink-200 to-purple-200"
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

      {/* Main Card */}
      <div
        className="p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 backdrop-blur-lg border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-900/50 text-center"
      >
        {user ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Welcome, {user.displayName}!
            </h1>
            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  user.photoURL ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwcRgFA-KFW6u0wScyvZEBWMLME5WkdeCUg&s"
                }
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
                alt="User Avatar"
              />
              <p className="text-lg font-semibold mt-3 text-gray-700 dark:text-gray-300">
                {user.email}
              </p>
            </div>
            <div className="space-x-3">
              <button
                onClick={handleEditClick}
                className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
              >
                Edit
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Welcome!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Sign up or sign in to continue your journey with us.
            </p>
            <div className="space-y-4">
              <Link
                to="/register"
                className="block py-3 px-6 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="block py-3 px-6 bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-105 shadow-md"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
