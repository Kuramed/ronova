import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const role = localStorage.getItem('user_role');
    
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    
    setIsAuthenticated(false);
    setUserRole(null);
    
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold" to="/">
          🎓 Plataforma de Cursos
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Visível para todos (Visitantes e Alunos) */}
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Início
              </Link>
            </li>

            {/* SE FOR UM ADMINISTRADOR: Mostra todas as ferramentas de gestão */}
            {isAuthenticated && userRole === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/admin/courses' ? 'active' : ''}`} 
                    to="/admin/courses"
                  >
                    Cursos & Categorias
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/admin/modules-lessons' ? 'active' : ''}`} 
                    to="/admin/modules-lessons"
                  >
                    Módulos & Aulas
                  </Link>
                </li>

                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/admin/trilhas' ? 'active' : ''}`} 
                    to="/admin/trilhas"
                  >
                    Trilhas
                  </Link>
                </li>

                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/admin/planos' ? 'active' : ''}`} 
                    to="/admin/planos"
                  >
                    Gestão de Planos
                  </Link>
                </li>
              </>
            )}

            {/* Planos / Checkout pode continuar visível para logados escolherem planos */}
            {isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/checkout' ? 'active' : ''}`} 
                  to="/checkout"
                >
                  Planos / Checkout
                </Link>
              </li>
            )}

            {/* Botões de Autenticação (Entrar/Cadastrar vs Sair) */}
            {isAuthenticated ? (
              <li className="nav-item ms-lg-3 mt-2 mt-xl-0">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger btn-sm w-100"
                >
                  Sair
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} 
                    to="/login"
                  >
                    Entrar
                  </Link>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-xl-0">
                  <Link 
                    className="btn btn-primary btn-sm text-white w-100" 
                    to="/register"
                  >
                    Cadastrar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}