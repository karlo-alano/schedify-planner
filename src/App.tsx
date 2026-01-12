//App
import './App.css'

//Imports
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentSession } from './scripts/userStore'

//Views
import Home from './views/Home'
import Calendar from './views/Calendar'
import Hero from './views/Hero'
import Signup from './views/Signup'
import Events from './views/Events'
import Create from './views/Create'
import Profile from './views/Profile'

//Components
import Navbar from './components/Navbar'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { session } = await getCurrentSession();
      setIsAuthenticated(!!session);
    };

    checkSession();
  }, []);

  // Show nothing while checking (or you could show a loading spinner)
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect to signup if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();

  const hideNavbarOnRoutes = ['/hero','/signup'];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      <main className='h-screen w-screen flex flex-col overflow-hidden'>
        <section className='flex-1 overflow-y-scroll'>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/hero" element={<Hero />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </section>
        {!shouldHideNavbar && (
          <section className='min-h-16 w-full'>
            <Navbar />
          </section>
        )}
      </main>
    </>
  )
}

export default App 
