import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import AuthLayout from "./Components/Layouts/AuthLayout/AuthLayout";
import DashboardLayout from "./Components/Layouts/DashboardLayout/DashboardLayout";
import LoginPage from "./Pages/Auth/LoginPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import UsersPage from "./Pages/Dashboard/UsersPage";
import ProfilesPage from "./Pages/Profiles";
import CreateProfile from "./Pages/Profiles/CreateProfilePage";
import ProfileEditor from "./Pages/Profiles/ProfileEditor";
import RecreateProfile from "./Pages/RecreateProfile";
import AuthProvider from "./Providers/AuthProvider";
function App() {
	const { accessToken } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Protected Dashboard layout routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profiles" element={<ProfilesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="create-profile" element={<CreateProfile />} />
            <Route path="profiles/editor/:slug" element={<ProfileEditor />} />
            <Route path="recreate-profile" element={<RecreateProfile />} />
          </Route>
        </Route>

        {/* Auth layout routes */}
        <Route path="auth/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Redirect any unknown routes to the dashboard or login page */}
        <Route
          path="*"
          element={
            <Navigate to={accessToken ? "/" : "/auth/login"} replace />
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
