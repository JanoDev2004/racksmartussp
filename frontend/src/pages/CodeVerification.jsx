import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";

const CodeVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const { sendVerificationCode, verifyCode } = useUserStore();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const hasSentOnce = useRef(false);
  const inputRefs = useRef([]);

  /** Send code ONCE on mount */
  useEffect(() => {
    if (!email) {
      toast.error("No email provided for verification.");
      navigate("/login");
      return;
    }

    if (!hasSentOnce.current) {
      hasSentOnce.current = true;
      handleSendCode();
    }
  }, []);

  /** Countdown (60 seconds) */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /** CALL Zustand sendVerificationCode */
  const handleSendCode = async () => {
    if (isSending) return;

    setIsSending(true);
    setTimer(60);

    try {
      await sendVerificationCode(email);
    } finally {
      setIsSending(false);
    }
  };

  /** Input handling */
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) inputRefs.current[index + 1].focus();
    if (error) setError(false);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  /** VERIFY USING Zustand verifyCode */
  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setError(true);
      toast.error("Please enter all 6 digits.");
      return;
    }

    const success = await verifyCode(email, enteredCode);

    if (success) {
      navigate("/dashboard");
    }
  };

  /** Border animation */
  const borderClass = error
    ? "border-red-500 animate-pulse"
    : code.every((d) => d !== "")
    ? "border-green-500 shadow-green-300 shadow-md"
    : "border-gray-300";

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/final background (1).png')" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            Enter Code Verification
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          We just sent a verification code to <b>{email}</b>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col items-center gap-6">
          <div className="flex justify-center gap-3 w-full max-w-xs">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value.slice(-1), i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                maxLength={1}
                className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border ${borderClass} focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-[#fa6709] hover:bg-[#e66a00] text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            Verify Code
          </button>
        </form>

        <div className="mt-4 text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-600">
              Resend available in <b>{timer}</b> seconds
            </p>
          ) : (
            <button
              onClick={handleSendCode}
              disabled={isSending}
              className="text-sm text-orange-600 font-semibold hover:text-orange-700 disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeVerification;