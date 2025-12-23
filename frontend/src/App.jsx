import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SidebarProvider } from "./context/SidebarContext";

import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Private Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

// Router Guards
import PrivateRoute from "./router/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SidebarProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                {/* ---------- PUBLIC ROUTES ---------- */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

                {/* Redirects for legacy routes if user attempts to go to /transactions directly */}
                <Route
                  path="/transactions"
                  element={<Navigate to="/app/transactions" replace />}
                />

                {/* ---------- PRIVATE ROUTES ---------- */}
                <Route element={<PrivateRoute />}>
                  <Route path="/app" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="budgets" element={<Budgets />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="admin" element={<Admin />} />
                  </Route>
                </Route>

                {/* ---------- 404 CATCH-ALL ---------- */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </SidebarProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
