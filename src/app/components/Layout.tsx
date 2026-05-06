import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Leaf, ScanLine, UserCircle2, Home, Newspaper } from 'lucide-react';
import { useAzure } from '../context/AzureContext';

export function Layout() {
  const { user } = useAzure();
  const location = useLocation();

  // Check if current route is Landing page to adjust container width
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-green-200 flex flex-col pb-16 md:pb-0">
      {/* Header */}
      <header className={`border-b border-stone-200 sticky top-0 z-50 ${isLandingPage ? 'bg-white/90 backdrop-blur-md' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-green-700 transition-colors">
              <Leaf size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-green-900">ESTufa</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `text-sm font-medium transition-colors hover:text-green-700 ${isActive ? 'text-green-700' : 'text-stone-500'}`}
            >
              Início
            </NavLink>
            <NavLink 
              to="/feed" 
              className={({ isActive }) => `text-sm font-medium transition-colors hover:text-green-700 ${isActive ? 'text-green-700' : 'text-stone-500'}`}
            >
              Feed
            </NavLink>
            <NavLink 
              to="/scan" 
              className={({ isActive }) => `text-sm font-medium transition-colors hover:text-green-700 ${isActive ? 'text-green-700' : 'text-stone-500'}`}
            >
              Identificar
            </NavLink>
            <NavLink 
              to={user ? "/profile" : "/login"}
              className={({ isActive }) => `text-sm font-medium transition-colors hover:text-green-700 ${isActive ? 'text-green-700' : 'text-stone-500'}`}
            >
              {user ? user.username : 'Entrar'}
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-grow w-full ${!isLandingPage ? 'max-w-5xl mx-auto px-4 py-6 md:py-10 pb-24 md:pb-10' : ''}`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-green-600' : 'text-stone-400'}`}
          >
            {({ isActive }) => (
              <>
                <Home size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Início</span>
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/feed" 
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-green-600' : 'text-stone-400'}`}
          >
            {({ isActive }) => (
              <>
                <Newspaper size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Feed</span>
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/scan" 
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-green-600' : 'text-stone-400'}`}
          >
            {({ isActive }) => (
              <>
                <ScanLine size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Scan</span>
              </>
            )}
          </NavLink>

          <NavLink 
            to={user ? "/profile" : "/login"}
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-green-600' : 'text-stone-400'}`}
          >
            {({ isActive }) => (
              <>
                <UserCircle2 size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{user ? 'Perfil' : 'Entrar'}</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
}
