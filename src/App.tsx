import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNav, Toast } from './components/ui';
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

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
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
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
