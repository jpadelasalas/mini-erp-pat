import React from "react";

const LoginPage = React.memo(
  ({
    userDetails,
    handleChange,
    handleLogin,
    handleSwitchPage,
    loginError,
  }) => {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Mini-ERP Login
        </h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Username</label>
          <input
            type="text"
            name="username"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loginError.username ? "border-red-500" : ""
            }`}
            value={userDetails.username}
            onChange={handleChange}
            required
          />
          {loginError.username && (
            <span className="text-red-500">{loginError.username}</span>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loginError.password ? "border-red-500" : "border-black"
            }`}
            value={userDetails.password}
            onChange={handleChange}
            required
          />
          {loginError.password && (
            <span className="text-red-500">{loginError.password}</span>
          )}
        </div>
        <div className="flex flex-col md:flex-row space-x-3 mb-3">
          <span className="opacity-80 text-gray-600">
            Don't have an account yet?
          </span>
          <span
            className="underline opacity-80 hover:opacity-100 text-blue-600 hover:text-blue-700 active:text-blue-900 cursor-pointer"
            onClick={handleSwitchPage}
          >
            Register here
          </span>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-5"
          onClick={handleLogin}
        >
          Log In
        </button>
      </>
    );
  }
);

export default LoginPage;
