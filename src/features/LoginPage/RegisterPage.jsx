import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import React from "react";

const RegisterPage = React.memo(
  ({
    userDetails,
    handleChange,
    handleRegister,
    handleSwitchPage,
    registerError,
  }) => {
    return (
      <>
        <span onClick={handleSwitchPage} className="cursor-pointer text-xs">
          <ArrowLeftIcon /> Back to Login
        </span>
        <h2 className="text-2xl font-bold mb-6 mt-3 text-gray-800 text-center">
          Mini-ERP Register
        </h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Username</label>
          <input
            type="text"
            name="username"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              registerError.username ? "border-red-500" : ""
            }`}
            value={userDetails.username}
            onChange={handleChange}
            required
          />
          {registerError.username && (
            <span className="text-red-500">{registerError.username}</span>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              registerError.password ? "border-red-500" : "border-black"
            }`}
            value={userDetails.password}
            onChange={handleChange}
            required
          />
          {registerError.password && (
            <span className="text-red-500">{registerError.password}</span>
          )}
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-5"
          onClick={handleRegister}
        >
          Register
        </button>
      </>
    );
  }
);

export default RegisterPage;
