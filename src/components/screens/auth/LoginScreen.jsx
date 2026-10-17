import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import TextInputField from "../../common/TextInputField";
import logo from "../../../assets/images/logo.png";
import loginImage from "../../../assets/images/login.webp";
import colors from "../../../styles/theme";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { login } = useAuth();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(formData.email.trim(), formData.password);
      success("Logged in successfully!");
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen lg:h-screen w-full flex font-poppins bg-white overflow-y-auto lg:overflow-hidden">
      {/* Left Side: Illustration Image */}
      <div className="hidden lg:flex lg:w-[50%] relative bg-white overflow-hidden items-end justify-center h-full shrink-0">
        <Link to="/" className="absolute top-6 left-6 xl:top-8 xl:left-8 z-10">
          <img
            src={logo}
            alt="4prints Logo"
            className="h-10 xl:h-14 object-contain"
          />
        </Link>

        <img
          src={loginImage}
          alt="Login illustration"
          className="w-full h-full object-contain object-bottom max-h-screen"
        />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center min-h-screen lg:min-h-0 px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 overflow-y-auto lg:overflow-visible">
        {/* Mobile Logo Link */}
        <div className="flex items-center justify-center w-full lg:hidden mb-6 sm:mb-8 shrink-0">
          <Link to="/" className="flex justify-center">
            <img
              src={logo}
              alt="4prints Logo"
              className="h-10 sm:h-12 object-contain"
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Please enter your email and password to access your 4prints customer account.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs sm:text-sm">
              <Icon
                icon="solar:danger-circle-bold"
                className="text-lg shrink-0"
              />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInputField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              leftIcon="solar:letter-linear"
            />

            <TextInputField
              label="Password"
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              leftIcon="ic:outline-password"
            />

            <div className="flex items-center justify-end pt-1 pb-2">
              <Link
                to="/forget-password"
                className="text-xs sm:text-sm text-yellow-700 font-medium hover:text-yellow-800 hover:underline transition-colors shrink-0"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#110C0B] hover:bg-black text-white font-semibold text-sm sm:text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <Icon
                    icon="svg-spinners:180-ring-with-bg"
                    className="text-xl"
                    color={colors.primary}
                  />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <Icon
                    icon="ep:arrow-right-bold"
                    className="text-sm"
                    color={colors.primary}
                  />
                </>
              )}
            </button>
          </form>


          {/* Sign Up Link */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-6 sm:mt-8">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="text-yellow-700 font-medium hover:text-yellow-800 hover:underline transition-colors"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
