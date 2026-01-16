import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";

const Login = () => {
  return (
    <AuthLayout title="Login to HeyChat">
      <div className="space-y-4">
        <AuthInput type="email" placeholder="Email" />
        <AuthInput type="password" placeholder="password" />

        <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium">
          Login
        </button>

        <p className="text-sm text-center text-gray-40">
          Don't have an account?{" "}
          <span className="text-green-500 cursor-pointer">Sign up</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
