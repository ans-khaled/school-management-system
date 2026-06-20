import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { IoPersonSharp } from "react-icons/io5";

import { useAuth } from "../contexts/AuthContext";

const inputStyle = `w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition`;

const routes = {
  super_admin: "/super_admin",
  admin: "/admin",
  student: "/student",
  teacher: "/teacher",
  parent: "/parent",
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;

  const passwordValue = watch("password");
  const showIcon = passwordValue?.length > 0;

  const { login, isAuthenticated, user, loading, error } = useAuth();

  useEffect(
    function () {
      if (!isAuthenticated) return;
      if (!user?.role) return;

      const path = routes[user?.role];

      if (path) {
        navigate(path, { replace: true });
      }
    },
    [isAuthenticated, navigate, user?.role],
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function onSubmit(data) {
    login(data);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 via-white to-indigo-50 font-sans">
      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-100 p-3 rounded-full">
              <IoPersonSharp className="text-indigo-600 text-2xl" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            School Management System
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              disabled={loading}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              aria-invalid={errors.email ? "true" : "false"}
              className={`${inputStyle} ${loading ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
            />
            {errors?.email?.message && (
              <p className="text-red-500 mt-0.5">{errors?.email?.message}</p>
            )}
          </div>

          {/* Password (optional add later) */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              disabled={loading}
              placeholder="Enter your password"
              {...register("password", {
                required: "This field is required!",
                minLength: {
                  value: 6,
                  message: "Password too short",
                },
              })}
              aria-invalid={errors.password ? "true" : "false"}
              className={`${inputStyle} ${loading ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
            />
            {errors?.password?.message && (
              <p className="text-red-500 mt-0.5">{errors?.password?.message}</p>
            )}

            {showIcon && (
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                className="absolute right-3 top-12 cursor-pointer -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 
                       text-white font-semibold py-3 rounded-lg 
                       transition duration-200 shadow-md
                       ${
                         loading
                           ? "bg-indigo-400 cursor-not-allowed"
                           : "bg-indigo-600 hover:bg-indigo-700"
                       }
                       `}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 School System. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
