import React, { useState, useRef, useEffect } from 'react'
import { Menu, X, User, Settings, LogOut, Bell } from 'lucide-react'

interface NavbarProps {
  currentUser?: string
  onRecepcionClick?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ currentUser = "Usuario WMS", onRecepcionClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  // Cerrar menú del usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">WMS</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Sistema WMS</span>
              </div>
            </div>
          </div>

          {/* Menú principal - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={onRecepcionClick}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 rounded-lg"
            >
              Recepción
            </button>
          </div>

          {/* Acciones del usuario - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notificaciones */}
            <button className="relative text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Menú del usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{currentUser}</span>
              </button>

              {/* Dropdown del usuario */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Mi Perfil
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Configuración
                  </a>
                  <div className="border-t my-2"></div>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Cerrar Sesión
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Botón del menú móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 space-y-2">
              <button 
                onClick={() => {
                  onRecepcionClick?.()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 rounded-lg"
              >
                Recepción
              </button>
              
              {/* Usuario móvil */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center px-3 py-2">
                  <User className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-600">{currentUser}</span>
                </div>
                <a href="#" className="block text-gray-600 hover:text-blue-600 px-6 py-2 text-sm transition-colors">
                  Mi Perfil
                </a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 px-6 py-2 text-sm transition-colors">
                  Configuración
                </a>
                <a href="#" className="block text-red-600 hover:bg-red-50 px-6 py-2 text-sm transition-colors">
                  Cerrar Sesión
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar