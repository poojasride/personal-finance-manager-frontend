import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import ResetPassword from "./Pages/ResetPassword";
import { Routes, Route, Link } from "react-router-dom";
import WelcomeBlog from "./Pages/Welcome";
import SuccessReset from "./Pages/SuccessReset";
import Dashboard from "./Pages/Dashboard";
import Budgets from "./Pages/Budgets";
import Transactions from "./Pages/Transactions";
import Goals from "./Pages/Goals";
import Analytics from "./Pages/Analytics";
import Recurring from "./Pages/Recurring";
import Categories from "./Pages/Categories";
import ExportCsv from "./Pages/ExportCsv";
import ExportPdf from "./Pages/ExportPdf";
import Settings from "./Pages/Settings";
import Logout from "./Pages/Logout";
import Layout from "./Pages/Layout";
import Notifications from "./Pages/notification";

function App() {
  return (
    <>
      {/* Authentication Side */}
      <div>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/welcome" element={<WelcomeBlog />} />
          <Route path="/success" element={<SuccessReset />} />
        </Routes>
      </div>

      <Routes>
        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/budgets" element={<Budgets />} />

          <Route path="/transactions" element={<Transactions />} />

          <Route path="/goals" element={<Goals />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/recurring" element={<Recurring />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/export-csv" element={<ExportCsv />} />
          <Route path="/export-pdf" element={<ExportPdf />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
