import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { BottomNav, Icon, Toast } from './components/ui';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SsoCallback from './pages/SsoCallback';
import AddFood from './pages/AddFood';
import Create from './pages/Create';
import Explore from './pages/Explore';
import FoodDetail from './pages/FoodDetail';
import History from './pages/History';
import Settings from './pages/Settings';
import Today from './pages/Today';
import { StoreProvider } from './store';

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  // Pantallas a pantalla completa (con su propia barra inferior de acción)
  const focused = /^\/(anadir|alimento|crear|ajustes)/.test(pathname);
  return (
    <div className={`mx-auto min-h-screen max-w-md bg-background ${focused ? '' : 'pb-28'}`}>
      <Outlet />
      {!focused && <BottomNav />}
      <Toast />
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Icon name="progress_activity" className="animate-spin text-primary-container" />
    </div>
  );
}

/** Solo deja pasar con sesión iniciada; si no, manda a /login. */
function RequireAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <Loading />;
  return isSignedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Pantallas de acceso: si ya hay sesión, vuelve al inicio. */
function PublicOnly() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <Loading />;
  return isSignedIn ? <Navigate to="/" replace /> : <Outlet />;
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnly />}>
            <Route path="/login" element={<SignIn />} />
            <Route path="/registro" element={<SignUp />} />
          </Route>
          <Route path="/sso-callback" element={<SsoCallback />} />
          <Route element={<RequireAuth />}>
          <Route element={<Shell />}>
            <Route path="/" element={<Today />} />
            <Route path="/historial" element={<History />} />
            <Route path="/anadir" element={<AddFood />} />
            <Route path="/explorar" element={<Explore />} />
            <Route path="/alimento/:id" element={<FoodDetail />} />
            <Route path="/crear" element={<Create />} />
            <Route path="/ajustes" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
