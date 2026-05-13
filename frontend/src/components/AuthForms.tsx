import React, { useState } from 'react';
import axios from 'axios';
import { authService } from '../services/auth';

interface AuthFormsProps {
  onLoginSuccess: () => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData);
      
      authService.setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden md:max-w-2xl mt-10">
      <div className="p-8">
        <div className="flex justify-center mb-8">
          <button 
            className={`px-6 py-2 font-bold ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`px-6 py-2 font-bold ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Registrarse
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? '¡Bienvenido de nuevo! 👋' : 'Crea tu cuenta educativa 🎓'}
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de usuario</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors mt-6 disabled:bg-indigo-400"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Registrarme')}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Diseñado para ser accesible y fácil de usar para todos. ♿
        </p>
      </div>
    </div>
  );
};

export default AuthForms;
