import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import TextInputField from "../../common/TextInputField";
import forgetImage from "../../../assets/images/forget.png";
import colors from "../../../styles/theme";

const ForgetPasswordScreen = () => {
  const navigate = useNavigate();

  // Step state: 1 = Enter Email, 2 = Enter OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP Timer states
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for Resend OTP (Step 2)
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer, canResend]);

  // Focus first OTP field on entering Step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Handle Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
    }, 1000);
  };

  // OTP Input handlers
  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (error) setError("");

    // Auto-focus next input field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      if (error) setError("");

      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setResendTimer(60);
    setCanResend(false);
    setError("");
    // Simulate resend code API call
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate OTP verification API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1000);
  };

  // Handle Step 3: Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate Reset Password API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1000);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex font-poppins bg-white overflow-y-auto lg:overflow-hidden">
      {/* Left Side: Illustration Image (50% width on lg, 60% width on xl) */}
      <div className="hidden lg:flex lg:w-[50%] relative bg-white overflow-hidden items-center justify-center h-full shrink-0 p-8 lg:p-12">
        <img
          src={forgetImage}
          alt="Forgot Password illustration"
          className="w-full h-full object-contain max-h-[80vh]"
        />
      </div>

      {/* Right Side: Content & Forms (100% width on mobile/md, 50% on lg, 40% on xl) */}
      <div className="w-full lg:w-[50%] xl:w-[40%] flex flex-col justify-center min-h-screen lg:min-h-0 px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 overflow-y-auto lg:overflow-visible">
        {/* Center Container */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-2 sm:py-4">
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

          {/* STEP 1: Get Email ID */}
          {step === 1 && (
            <div>
              <div className="mb-6 sm:mb-10 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Forgot Password?
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                  Don't worry! Enter your registered email address and we'll
                  send you a 6-digit OTP to reset your password.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <TextInputField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  leftIcon="solar:letter-linear"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-8 py-3 px-6 rounded-xl bg-[#110C0B] hover:bg-black text-white font-semibold text-sm sm:text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Icon
                        icon="svg-spinners:180-ring-with-bg"
                        className="text-xl"
                        color={colors.primary}
                      />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <Icon
                        icon="ep:arrow-right-bold"
                        className="text-sm"
                        color={colors.primary}
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Enter & Verify OTP */}
          {step === 2 && (
            <div>
              <div className="mb-6 sm:mb-10 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Verify OTP Code
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 lg:max-w-none lg:whitespace-nowrap">
                  We have sent a 6-digit verification code to{" "}
                  <span className="font-semibold text-gray-900">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="text-xs text-yellow-700 font-medium hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <Icon icon="solar:pen-linear" className="text-xs" />
                  <span>Change Email</span>
                </button>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit Input Boxes */}
                <div
                  className="flex items-center justify-between gap-2 sm:gap-3"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-11 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border bg-white text-gray-900 transition-all focus:outline-none ${
                        digit
                          ? "border-yellow-400 border-2"
                          : "border-gray-300 hover:border-gray-400 focus:border-yellow-400 focus:border-2"
                      }`}
                    />
                  ))}
                </div>

                {/* Resend Code Section */}
                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <span className="text-gray-500">
                    Didn't receive the code?
                  </span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-yellow-700 font-semibold hover:text-yellow-800 hover:underline cursor-pointer transition-colors"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-gray-400 font-medium flex items-center gap-1">
                      Resend in{" "}
                      <span className="text-gray-700 font-bold">
                        {resendTimer}s
                      </span>
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-xl bg-[#110C0B] hover:bg-black text-white font-semibold text-sm sm:text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Icon
                        icon="svg-spinners:180-ring-with-bg"
                        className="text-xl"
                        color={colors.primary}
                      />
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <Icon
                        icon="ep:arrow-right-bold"
                        className="text-sm"
                        color={colors.primary}
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <div>
              <div className="mb-6 sm:mb-10 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Create New Password
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                  Your identity has been verified. Enter a new password below to
                  secure your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <TextInputField
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  leftIcon="ic:outline-password"
                  allowPasswordToggle
                />

                <TextInputField
                  label="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  leftIcon="ic:outline-password"
                  allowPasswordToggle
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-10 py-3 px-6 rounded-xl bg-[#110C0B] hover:bg-black text-white font-semibold text-sm sm:text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Icon
                        icon="svg-spinners:180-ring-with-bg"
                        className="text-xl"
                        color={colors.primary}
                      />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <Icon
                        icon="ep:arrow-right-bold"
                        className="text-sm"
                        color={colors.primary}
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success View */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-700">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-4xl sm:text-5xl text-yellow-600"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Password Reset!
              </h2>

              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto mb-8">
                Your password has been reset successfully. You can now use your
                new password to log in to your account.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-3 px-6 rounded-xl bg-[#110C0B] hover:bg-black text-white font-semibold text-sm sm:text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Back to Sign In</span>
                <Icon
                  icon="ep:arrow-right-bold"
                  className="text-sm"
                  color={colors.primary}
                />
              </button>
            </div>
          )}

          {/* Footer Sign In Link */}
          {step === 1 && (
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-6 sm:mt-8">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-yellow-700 font-medium hover:text-yellow-800 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordScreen;
