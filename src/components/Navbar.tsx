import { useLocation, useNavigate } from 'react-router-dom'
import { HomeIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

const navItems = [
  { icon: HomeIcon, label: 'Home', path: '/home', color: 'text-gray-500', strokeWidth: 1.5 },
  { icon: CalendarIcon, label: 'Calendar', path: '/calendar', color: 'text-gray-600', strokeWidth: 1.5 },
  { icon: ClockIcon, label: 'Events', path: '/events', color: 'text-gray-600', strokeWidth: 1.5 },
  { icon: UserIcon, label: 'Profile', path: '/profile', color: 'text-gray-600', strokeWidth: 1.5 }
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    // Handle both "/" and "/home" as the same route
    if (path === '/home' && (location.pathname === '/' || location.pathname === '/home')) {
      return true
    }
    return location.pathname === path
  }

  return (
    <main className="w-full h-full bg-white border-t border-gray-200 p-2">
      <ul className="flex gap-4 items-center h-full">
        {navItems.map(({ icon: Icon, label, path, color, strokeWidth }) => {
          const active = isActive(path)
          
          return (
            <li 
              key={label}
              className={`flex-1 flex flex-col items-center gap-1 cursor-pointer rounded-xl p-2 transition-all duration-300 ease-in-out transform ${
                active 
                  ? 'bg-primary-100 text-primary-700 shadow-sm scale-105' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 hover:scale-102'
              }`}
              onClick={() => navigate(path)}
            >
              <Icon 
                className={`h-6 w-6 transition-all duration-300 ease-in-out ${
                  active 
                    ? 'text-primary-700 scale-110' 
                    : `${color} group-hover:scale-105`
                }`} 
                strokeWidth={strokeWidth} 
              />
              <span className={`text-xs font-medium transition-all duration-300 ease-in-out ${
                active ? 'scale-105' : ''
              }`}>
                {label}
              </span>
            </li>
          )
        })}
      </ul>
    </main>
  )
}