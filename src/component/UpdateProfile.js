import { useState, useEffect } from "react";
import { update, emailVerification } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { updateUser, login } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

export default function UpdateProfile() {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setAvatar(currentUser.photoURL || "");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await update({ displayName, photoURL: avatar });
      await auth.currentUser.reload();
      setDisplayName(auth.currentUser.displayName);
      dispatch(updateUser({ displayName: auth.currentUser.displayName }));
      dispatch(login(auth.currentUser));
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-blue-200 via-pink-200 to-purple-200"
      } flex items-center justify-center min-h-screen transition-all duration-300 relative overflow-hidden`}
    >
      <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 top-10 left-10 ${darkMode ? "bg-purple-500" : "bg-teal-300"}`}></div>
      <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 bottom-10 right-10 ${darkMode ? "bg-orange-500" : "bg-pink-300"}`}></div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 bg-gray-300 dark:bg-gray-700 rounded-full shadow-lg"
      >
        {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-900" />}
      </button>

      <div className="p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-900/50 text-center">
        <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
        <img
          src={avatar || "https://via.placeholder.com/100"}
          className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mx-auto"
          alt="User Avatar"
        />
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-3">Profile updated successfully!</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Avatar URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update
          </button>
        </form>

        {user.emailVerified && (
          
          <button
            onClick={emailVerification}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            
          >
            Verify Email
          </button>
        )}
      </div>
    </div>
  );
}
