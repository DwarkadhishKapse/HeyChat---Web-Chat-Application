import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../auth/AuthLayout";
import AuthInput from "../auth/AuthInput";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await loginUser({
        email,
        password,
      });

      // store token
      localStorage.setItem("token", data.token);

      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

      // This will update Auth state immediately
      setUser(data.user);

      navigate("/chat");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to HeyChat">
      <div className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-40">
          Don't have an account?{" "}
          <span
            className="text-green-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
