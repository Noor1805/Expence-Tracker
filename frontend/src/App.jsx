import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}


