
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import Calendar from './views/Calendar'

import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <main className='max-h-screen w-screen flex flex-col'>
        <section className='flex-1 overflow-y-scroll'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </section>
        <section className='min-h-16 w-full'>
          <Navbar />
        </section>
      </main>
    </>
  )
}

export default App 
