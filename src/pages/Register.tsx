import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Cria a conta no back-end
      await api.post('/users', { name, email, password });

      // 2. Faz o login automático com as mesmas credenciais
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.access_token;
      
      // 3. Salva token e decodifica para pegar o role (igual no Login.tsx)
      localStorage.setItem('access_token', token);
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      localStorage.setItem('user_role', payload.role);

      // 4. Redireciona para o Início (O menu Nav vai ler o token e sumir com os botões)
      navigate('/');
      
    } catch (err: any) {
      setError('Erro ao criar conta. Este e-mail pode já estar em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Criar Conta</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Seu Nome"
                />
              </div>

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
                <label className="form-label">Senha (mínimo de 6 caracteres)</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="******"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 mb-3" 
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              <div className="text-center">
                <small className="text-muted">
                  Já possui uma conta? <Link to="/login">Faça login</Link>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}