import React, { useEffect, useState } from 'react'
import { ChatProvider } from './context/ChatContext'
import ChatInterface from './components/ChatInterface'
import LessonsList from './components/LessonsList'
import AuthForms from './components/AuthForms'
import { authService } from './services/auth'
import './services/auth' // Initialize axios interceptors

function App() {
  const [view, setView] = useState<'home' | 'lessons' | 'chat'>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated())
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated) {
      const savedUser = localStorage.getItem('user')
      if (savedUser) setUser(JSON.parse(savedUser))
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setView('home')
  }

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navbar */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">IA Educativa 🧑‍🎓</h1>
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setView('home')}
                  className={`px-4 py-2 rounded transition-colors ${
                    view === 'home'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => setView('lessons')}
                  className={`px-4 py-2 rounded transition-colors ${
                    view === 'lessons'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Lecciones
                </button>
                <button
                  onClick={() => setView('chat')}
                  className={`px-4 py-2 rounded transition-colors ${
                    view === 'chat'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Chat
                </button>
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-4 border-l pl-6">
                  <span className="text-sm font-semibold text-gray-600">Hola, {user?.username}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="border-l pl-6">
                  <button 
                    onClick={() => setView('home')}
                    className="text-sm font-bold text-indigo-600 hover:underline"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {view === 'home' && (
            !isAuthenticated ? (
              <AuthForms onLoginSuccess={() => setIsAuthenticated(true)} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  ¡Bienvenido a IA Educativa para Personas Sordas!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Una plataforma interactiva de aprendizaje de programación orientada a objetos con
                  accesibilidad completa.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setView('lessons')}>
                    <h3 className="text-2xl font-bold text-indigo-600 mb-2">📚 Lecciones</h3>
                    <p className="text-gray-600">
                      Aprende programación orientada a objetos de forma interactiva
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => setView('chat')}>
                    <h3 className="text-2xl font-bold text-indigo-600 mb-2">🤖 Profesor IA</h3>
                    <p className="text-gray-600">
                      Un profesor virtual inteligente que se adapta a tu ritmo
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-2">♿ Accesible</h3>
                    <p className="text-gray-600">
                      Diseñado específicamente para personas sordas
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {view === 'lessons' && (
            isAuthenticated ? <LessonsList /> : <AuthForms onLoginSuccess={() => setIsAuthenticated(true)} />
          )}

          {view === 'chat' && (
            isAuthenticated ? <ChatInterface /> : <AuthForms onLoginSuccess={() => setIsAuthenticated(true)} />
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-6 mt-12">
          <p>
            © 2024 IA Educativa para Personas Sordas • Construyamos educación inclusiva juntos ♿
          </p>
        </footer>
      </div>
    </ChatProvider>
  )
}

export default App
