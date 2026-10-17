import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "../../../assets/images/logo.png";
import otpImage from "../../../assets/images/otp.png";
import colors from "../../../styles/theme";

const OtpScreen = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer, canResend]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last character typed if user enters multiple chars in single field
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (error) setError("");

    // Auto-focus next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: clear current or move to previous field
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
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

      // Focus appropriate field after paste
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification logic
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex font-poppins bg-white overflow-y-auto lg:overflow-hidden">
      {/* Left Side: Illustration Image (50% width on lg, 60% on xl) */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[60%] relative bg-white overflow-hidden items-center justify-center h-full shrink-0 p-8 lg:p-12">
        {/* Top-Left Logo */}
        <Link to="/" className="absolute top-6 left-6 xl:top-8 xl:left-8 z-10">
          <img
            src={logo}
            alt="4prints Logo"
            className="h-10 xl:h-14 object-contain"
          />
        </Link>

        <img
          src={otpImage}
          alt="OTP illustration"
          className="w-full h-full object-contain max-h-[85vh]"
        />
      </div>

      {/* Right Side: OTP Content & Form (100% width on mobile/md, 50% on lg, 40% on xl) */}
      <div className="w-full lg:w-[50%] xl:w-[40%] flex flex-col justify-between min-h-screen lg:min-h-0 px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 overflow-y-auto lg:overflow-visible">
        {/* Top Header Navigation */}
        <div className="w-full flex items-center max-w-sm sm:max-w-md mx-auto justify-between lg:justify-start shrink-0 mb-6 lg:mb-0">
          {/* Logo visible only on mobile/tablet when left image column is hidden */}
          <Link to="/" className="lg:hidden flex items-center">
            <img
              src={logo}
              alt="4prints Logo"
              className="h-10 sm:h-12 object-contain"
            />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon
              icon="solar:alt-arrow-left-linear"
              className="text-base sm:text-lg"
            />
            <span>Back to Sign In</span>
          </Link>
        </div>

        {/* Center OTP Container */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">
          {/* Header Icon & Text */}
          <div className="mb-6 sm:mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              OTP Verification
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              We have sent a 6-digit verification code to your registered email
              address. Please enter it below.
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

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div
              className="flex items-center justify-between gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-11 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border bg-white text-gray-900 transition-all focus:outline-none ${
                    digit
                      ? "border-yellow-300 border-2"
                      : "border-gray-500 hover:border-gray-600 focus:border-yellow-400 focus:border-2"
                  }`}
                />
              ))}
            </div>

            {/* Resend Code Section */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
              <span className="text-gray-500">Didn't receive the code?</span>
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

            {/* Submit Button */}
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
                  <span>Verifying Code...</span>
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
      </div>
    </div>
  );
};

export default OtpScreen;