import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    // handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // focuts on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex(
        (digit: number | string) => digit !== ""
      );
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const verifyCode = code.join("");
    try {
      await verifyEmail(verifyCode);
      navigate("/");
      toast.success("Email verified successfully");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "") && submitBtnRef.current) {
      submitBtnRef.current.click();
    }
  }, [code]);
  return (
    <div className="max-w-md w-full bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-700 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter the 6-digit code sent your email address.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <Input
                key={index}
                type="text"
                ref={(element) => {
                  if (element) {
                    inputRefs.current[index] = element;
                  }
                }}
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl bg-gray-800/50 text-white border-2
                 border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 font-semibold mt-2 text-center">
              {error}
            </p>
          )}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-linear-to-r from-green-500 to-emerald-600
          text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
          focus:ring-offset-gray-900 transition durtion-200 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 
          "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={code.some((digit) => !digit)}
            ref={submitBtnRef}
          >
            Verify
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
