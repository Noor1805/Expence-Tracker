import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import AppLayout from "./components/layout/AppLayout";

// Public Pages
import Home from "./pages/Home";
{/*}
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Private Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";

// Router Guards
import PrivateRoute from "./router/PrivateRoute";*/}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/" element={<Home />} />
          {/*}
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />*/}

          {/* ---------- PRIVATE ROUTES ---------- 
          <Route element={<PrivateRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
            </Route>
          </Route>
*/}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
