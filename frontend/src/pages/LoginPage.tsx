import React, { useState } from "react";
import Input from "../components/input";
import { motion } from "framer-motion";
import { Lock, Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  let isLoading = false;

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/30  backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
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
          <div className="text-sm text-green-500 cursor-pointer hover:underline">
            Forgot Password?
          </div>
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-linear-to-r from-green-500 to-emerald-600
                  text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                  focus:ring-offset-gray-900 transition durtion-200 cursor-pointer
                  "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 mx-auto animate-spin" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-sm text-green-500">
            Signup
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
