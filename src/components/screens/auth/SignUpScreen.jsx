import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import TextInputField from "../../common/TextInputField";
import logo from "../../../assets/images/logo.png";
import loginImage from "../../../assets/images/login.webp";
import colors from "../../../styles/theme";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

const SignUpScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
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
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobileNo: formData.mobileNo ? Number(formData.mobileNo) : undefined,
        countryCode: "91",
      });

      success("Account created successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. An account with this email may already exist.");
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
          alt="Sign up illustration"
          className="w-full h-full object-contain object-bottom max-h-screen"
        />
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center min-h-screen lg:min-h-0 px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 overflow-y-auto">
        <div className="flex items-center justify-center w-full lg:hidden mb-6 sm:mb-8 shrink-0">
          <Link to="/" className="flex justify-center">
            <img
              src={logo}
              alt="4prints Logo"
              className="h-10 sm:h-12 object-contain"
            />
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create an Account
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Join 4prints to track your orders, upload custom artwork, and save multiple shipping addresses.
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
              label="Full Name"
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={handleChange}
              leftIcon="solar:user-linear"
            />

            <TextInputField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon="solar:letter-linear"
            />

            <TextInputField
              label="Mobile Number (Optional)"
              id="mobileNo"
              name="mobileNo"
              type="tel"
              placeholder="9876543210"
              value={formData.mobileNo}
              onChange={handleChange}
              leftIcon="solar:phone-linear"
            />

            <TextInputField
              label="Password (min 6 characters)"
              id="password"
              name="password"
              type="password"
              required
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              leftIcon="ic:outline-password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 px-6 rounded-xl bg-[#110C0B] hover:bg-black text-white font-semibold text-sm sm:text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <Icon
                    icon="svg-spinners:180-ring-with-bg"
                    className="text-xl"
                    color={colors.primary}
                  />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <Icon
                    icon="ep:arrow-right-bold"
                    className="text-sm"
                    color={colors.primary}
                  />
                </>
              )}
            </button>
          </form>


          {/* Sign In Link */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-6 sm:mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-700 font-medium hover:text-yellow-800 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
