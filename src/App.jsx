import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Loading from "./components/Loading.jsx";

const PublicRoute = lazy(() => import("./components/PublicRoute.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

const ProtectedRoute = lazy(() => import("./components/ProtectedRoute.jsx"));
const Layout = lazy(() => import("./layout/Layout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Inventory = lazy(() => import("./pages/Inventory.jsx"));
const Sales = lazy(() => import("./pages/Sales.jsx"));
const Employees = lazy(() => import("./pages/Employees.jsx"));
const Setup = lazy(() => import("./pages/Setup.jsx"));

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Redirect root and wildcard */}
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="sales" element={<Sales />} />
              <Route path="employees" element={<Employees />} />
              <Route path="setup" element={<Setup />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
