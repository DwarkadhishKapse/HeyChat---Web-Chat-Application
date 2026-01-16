import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";

const Signup = () => {
  return (
    <AuthLayout title="Create HeyChat Account">
      <div className="space-y-4">
        <AuthInput type="text" placeholder="Name" />
        <AuthInput type="email" placeholder="Email" />
        <AuthInput type="password" placeholder="Password" />

        <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium">
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span className="text-green-500 cursor-pointer">Login</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
