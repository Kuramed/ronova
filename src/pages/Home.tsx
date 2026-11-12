import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function Home() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [trilhas, setTrilhas] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);

  // Estados para controlar a exibição do banner de login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // 1. Verifica se o utilizador está logado ao carregar a página
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const payload = JSON.parse(jsonPayload);
        setUserName(payload.email.split('@')[0]); // Pega o início do e-mail para usar como nome
      } catch (e) {
        console.error('Erro ao ler token do usuário', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [cursosRes, catsRes, trilhasRes, planosRes] = await Promise.all([
          api.get('/cursos').catch((err) => { console.error('Erro cursos', err); return { data: [] }; }),
          api.get('/categorias').catch(() => ({ data: [] })),
          api.get('/trilhas').catch(() => ({ data: [] })),
          api.get('/planos').catch((err) => { console.error('Erro planos', err); return { data: [] }; }),
        ]);
        
        setCursos(cursosRes.data);
        setCategorias(catsRes.data);
        setTrilhas(trilhasRes.data);
        setPlanos(planosRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados públicos da página inicial:', err);
      }
    };

    fetchPublicData();
  }, []);

  return (
    <div className="container py-5">
      
      {/* 2. Hero Section Condicional (Se NÃO estiver logado, pede para criar conta) */}
      {!isAuthenticated ? (
        <div className="p-5 mb-5 bg-light rounded-3 shadow-sm border text-center">
          <div className="container-fluid py-4">
            <h1 className="display-5 fw-bold mb-3">Bem-vindo à Plataforma de Cursos</h1>
            <p className="col-md-8 fs-4 mx-auto text-muted">
              Explore nosso catálogo de cursos, trilhas de conhecimento e planos de assinatura. Comece a sua jornada de aprendizado hoje mesmo!
            </p>
            <div className="mt-4">
              <Link to="/register" className="btn btn-primary btn-lg me-3 px-4">
                Criar Conta Gratuita
              </Link>
              <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Se JÁ ESTIVER logado, mostra apenas uma faixa de boas-vindas menor */
        <div className="p-4 mb-5 bg-primary text-white rounded-3 shadow-sm d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold m-0">Olá, {userName}! Que bom ter você aqui.</h3>
            <p className="m-0 mt-1">Continue a sua jornada de aprendizado e explore os nossos conteúdos.</p>
          </div>
        </div>
      )}

      {/* Seção de Categorias */}
      {categorias.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-3 fw-bold">Explore por Categorias</h3>
          <div className="row g-3">
            {categorias.map((cat: any) => (
              <div className="col-md-3" key={cat.id_categoria || cat.id}>
                <div className="card shadow-sm border-0 h-100 bg-white text-center">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-primary">{cat.nome || cat.Nome}</h5>
                    <p className="card-text text-muted small">{cat.descricao || cat.Descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção de Cursos em Destaque */}
      <section className="mb-5">
        <h3 className="mb-3 fw-bold">Cursos Disponíveis</h3>
        {cursos.length === 0 ? (
          <div className="alert alert-secondary text-center">Nenhum curso cadastrado no momento.</div>
        ) : (
          <div className="row g-4">
            {cursos.map((curso: any) => {
              const totalAulas = curso.totalAulas ?? curso.TotalAulas ?? curso.total_aulas ?? 0;
              const totalHoras = curso.totalHoras ?? curso.TotalHoras ?? curso.total_horas ?? 0;
              
              return (
                <div className="col-md-4" key={curso.id || curso.id_curso}>
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-secondary align-self-start mb-2">{curso.nivel || curso.Nivel || 'Iniciante'}</span>
                      <h5 className="card-title fw-bold">{curso.titulo || curso.Titulo}</h5>
                      <p className="card-text text-muted flex-grow-1">{curso.descricao || curso.Descricao}</p>
                      <div className="text-muted small mt-2 border-top pt-2">
                        <span>Aulas: {totalAulas}</span> | <span>Carga Horária: {totalHoras}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Seção de Trilhas de Conhecimento */}
      {trilhas.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-3 fw-bold">Trilhas de Aprendizado</h3>
          <div className="row g-4">
            {trilhas.map((trilha: any) => (
              <div className="col-md-6" key={trilha.id || trilha.ID_Trilha}>
                <div className="card shadow-sm border-0 bg-light h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-dark">{trilha.titulo || trilha.Titulo}</h5>
                    <p className="card-text text-muted">{trilha.descricao || trilha.Descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção de Planos e Assinaturas */}
      <section className="mb-5">
        <h3 className="mb-3 fw-bold text-center">Nossos Planos de Assinatura</h3>
        {planos.length === 0 ? (
          <div className="alert alert-warning text-center">Nenhum plano disponível publicamente no momento. (Verifique se a rota /planos no back-end exige login).</div>
        ) : (
          <div className="row g-4 justify-content-center">
            {planos.map((plano: any) => (
              <div className="col-md-4" key={plano.id || plano.ID_Plano}>
                <div className="card shadow-sm border-0 h-100 text-center">
                  <div className="card-body d-flex flex-column">
                    <h4 className="card-title fw-bold">{plano.nome || plano.Nome}</h4>
                    <p className="card-text text-muted">{plano.descricao || plano.Descricao}</p>
                    <h3 className="text-primary my-3">R$ {plano.preco || plano.Preco}</h3>
                    <Link to="/checkout" className="btn btn-outline-primary mt-auto">
                      Ver Detalhes / Assinar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}