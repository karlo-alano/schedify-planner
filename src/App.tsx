//App
import './App.css'

//Imports
import { Routes, Route, useLocation } from 'react-router-dom'


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

function App() {
  const location = useLocation();

  const hideNavbarOnRoutes = ['/hero','/signup'];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);


  return (
    <>
      <main className='h-screen w-screen flex flex-col overflow-hidden'>
        <section className='flex-1 overflow-y-scroll'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/events" element={<Events />} />
            <Route path="/hero" element={<Hero />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
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
