import { type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import WardrobePage from "./pages/WardrobePage";
import CreatorPage from "./pages/CreatorPage";
import OutfitsPage from "./pages/OutfitsPage";
import ImpressumPage from "./pages/ImpressumPage";
import PrivacyPage from "./pages/PrivacyPage";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/wardrobe" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />
        <Route
          path="/wardrobe"
          element={
            <RequireAuth>
              <WardrobePage />
            </RequireAuth>
          }
        />
        <Route
          path="/outfits"
          element={
            <RequireAuth>
              <OutfitsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/creator"
          element={
            <RequireAuth>
              <CreatorPage />
            </RequireAuth>
          }
        />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/wardrobe" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
