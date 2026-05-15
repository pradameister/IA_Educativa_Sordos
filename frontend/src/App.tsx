import React, { useEffect, useState } from 'react'
import { ChatProvider } from './context/ChatContext'
import ChatInterface from './components/ChatInterface'
import LessonsList from './components/LessonsList'
import AuthForms from './components/AuthForms'
import Glossary from './components/Glossary'
import { authService } from './services/auth'
import './services/auth' // Initialize axios interceptors

function App() {
  const [view, setView] = useState<'home' | 'lessons' | 'chat' | 'glossary'>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated())
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

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
    setIsMenuOpen(false)
  }

  const navigate = (newView: 'home' | 'lessons' | 'chat' | 'glossary') => {
    setView(newView)
    setIsMenuOpen(false)
  }

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col transition-colors duration-300">
        {/* Navbar Responsivo */}
        <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
                <span className="text-xl md:text-2xl font-bold text-indigo-600">IA Educativa 🧑‍🎓</span>
              </div>
              
              {/* Botón menú móvil */}
              <div className="md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-indigo-600 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Menú Desktop */}
              <div className="hidden md:flex items-center gap-4">
                <button onClick={() => navigate('home')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'home' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Inicio</button>
                <button onClick={() => navigate('lessons')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'lessons' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Lecciones</button>
                <button onClick={() => navigate('chat')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'chat' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Chat</button>
                <button onClick={() => navigate('glossary')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'glossary' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}>Glosario</button>
                
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-yellow-400"
                  title="Cambiar Modo"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center gap-4 ml-4 border-l pl-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{user?.username}</span>
                    <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-semibold">Salir</button>
                  </div>
                ) : (
                  <button onClick={() => navigate('home')} className="ml-4 text-sm font-bold text-indigo-600 hover:text-indigo-800">Iniciar Sesión</button>
                )}
              </div>
            </div>
          </div>

          {/* Menú Móvil */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
              <button onClick={() => navigate('home')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50">Inicio</button>
              <button onClick={() => navigate('lessons')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50">Lecciones</button>
              <button onClick={() => navigate('chat')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50">Chat</button>
              <button onClick={() => navigate('glossary')} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50">Glosario</button>
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-100 mt-2">
                  <div className="px-3 py-2 text-sm font-bold text-gray-500 uppercase">{user?.username}</div>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600">Cerrar Sesión</button>
                </div>
              ) : (
                <button onClick={() => navigate('home')} className="block w-full text-left px-3 py-2 text-base font-medium text-indigo-600">Iniciar Sesión</button>
              )}
            </div>
          )}
        </nav>

        {/* Contenedor Principal Consistente */}
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-6 md:py-10">
          <div className="w-full animate-fadeIn">
            {view === 'home' && (
              !isAuthenticated ? (
                <AuthForms onLoginSuccess={() => setIsAuthenticated(true)} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-12 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                    ¡Bienvenido a tu <span className="text-indigo-600 dark:text-indigo-400">Futuro Digital</span>! ♿
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
                    Aprende programación orientada a objetos con un profesor IA diseñado para ser 100% visual y accesible.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 cursor-pointer hover:shadow-md transition-all transform hover:-translate-y-1" onClick={() => navigate('lessons')}>
                      <div className="text-3xl mb-4">📚</div>
                      <h3 className="text-xl font-bold text-indigo-900 mb-2">Lecciones</h3>
                      <p className="text-sm text-indigo-700">Explora conceptos de POO con retos interactivos.</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 cursor-pointer hover:shadow-md transition-all transform hover:-translate-y-1" onClick={() => navigate('chat')}>
                      <div className="text-3xl mb-4">🤖</div>
                      <h3 className="text-xl font-bold text-green-900 mb-2">Profesor IA</h3>
                      <p className="text-sm text-green-700">Resuelve tus dudas en tiempo real con nuestra IA.</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6 hover:shadow-sm transition-all">
                      <div className="text-3xl mb-4">♿</div>
                      <h3 className="text-xl font-bold text-purple-900 mb-2">Accesibilidad</h3>
                      <p className="text-sm text-purple-700">Diseñado por y para la comunidad sorda.</p>
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

            {view === 'glossary' && (
              isAuthenticated ? <Glossary /> : <AuthForms onLoginSuccess={() => setIsAuthenticated(true)} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 IA Educativa para Personas Sordas • Educación Inclusiva ♿
            </p>
          </div>
        </footer>
      </div>
    </ChatProvider>
  )
}

export default App
