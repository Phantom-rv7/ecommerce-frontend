import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { MessageResponse } from "../types/api-types";
import { userExist } from "../redux/reducer/userReducer";



const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [login] = useLoginMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectTo =
    location.state?.from || location.state?.fallbackRedirect || "/";

  useEffect(() => {
    toast.dismiss(); // Clear lingering toasts on mount
  }, []);

  const loginHandler = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const payload: any = {
        name: user.displayName || "Guest",
        email: user.email || `guest-${user.uid}@example.com`,
        photo: user.photoURL || "/default-avatar.png",
        role: "user",
        _id: user.uid,
      };

      if (gender) payload.gender = gender;
      if (date) payload.dob = date;

      const res = await login(payload);

      if ("data" in res && res.data) {
        toast.success(res.data.message);
        dispatch(userExist(payload));
        requestAnimationFrame(() => {
          navigate(redirectTo, { replace: true });
        });
      } else {
        const error = res.error as FetchBaseQueryError;
        const message =
          (error.data as MessageResponse)?.message || "Login failed";

        if (message === "Email already exists") {
          toast.success("Welcome back! You're already registered.");
          dispatch(userExist(payload));
          requestAnimationFrame(() => {
            navigate(redirectTo, { replace: true });
          });
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error("Sign In Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>
            Gender <span style={{ fontSize: "0.8rem", color: "#888" }}>(optional)</span>
          </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>
            Date of Birth <span style={{ fontSize: "0.8rem", color: "#888" }}>(optional)</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed in Once</p>
          <button onClick={loginHandler} disabled={loading}>
            <FcGoogle />
            <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;


