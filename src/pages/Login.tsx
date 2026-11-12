import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Requisição POST para a rota /auth/login
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.access_token;
      
      // 2. Salva o token JWT
      localStorage.setItem('access_token', token);

      // 3. Decodifica o token para extrair o cargo (role)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      // 4. Salva o role ('ADMIN' ou 'ALUNO') para o Nav.tsx ler
      localStorage.setItem('user_role', payload.role);

      // 5. Redirecionamento inteligente
      if (payload.role === 'ADMIN') {
        navigate('/admin/courses');
      } else {
        navigate('/'); // Aluno vai para o Início
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Entrar na Plataforma</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="******"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={loading}
              >
                {loading ? 'Entrar...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}