import React, { useState } from "react";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { toast } from "react-hot-toast";

const SignupPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, signup, error, isLoading } = useAuthStore();

  const navigate = useNavigate();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signup({ name, email, password });
      console.log("test");
      navigate("/verify-email");
      console.log(isLoading);
    } catch (error) {
      console.log(error);
      console.log(isLoading);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/30  backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text ">
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={<User />}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <Input
            icon={<Mail />}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Input
            icon={<Lock />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          {/* Password Strength Meter */}
          {error && (
            <p className="text-red-500 font-semibold mt-2 text-center">
              {error}
            </p>
          )}
          <PasswordStrengthMeter password={password} />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-linear-to-r from-green-500 to-emerald-600
          text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
          focus:ring-offset-gray-900 transition durtion-200 cursor-pointer
          "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
