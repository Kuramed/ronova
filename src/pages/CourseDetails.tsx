import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/cursos/${id}`);
        setCourse(response.data);
      } catch (err) {
        // Fallback simulado caso o backend não responda o ID específico
        setCourse({
          titulo: 'Desenvolvimento Web Fullstack',
          descricao: 'Aprenda do zero ao avançado.',
          nivel: 'Intermediário',
          totalHoras: 40,
          modulos: [
            { id: 1, titulo: 'Módulo 1: Introdução ao React', ordem: 1, aulas: [{ id: 1, titulo: 'Aula 1: Configuração', tipoConteudo: 'Vídeo', duracaoMinutos: 15 }] }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="container mt-4">Carregando detalhes do curso...</div>;

  return (
    <div className="container mt-4">
      <Link to="/courses" className="btn btn-outline-secondary mb-3">← Voltar para Cursos</Link>
      {course && (
        <div>
          <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
            <h1 className="display-6 fw-bold">{course.titulo || course.Titulo}</h1>
            <p className="col-md-8 fs-4">{course.descricao || course.Descricao}</p>
            <span className="badge bg-primary me-2">Nível: {course.nivel || course.Nivel}</span>
            <span className="badge bg-secondary">Carga Horária: {course.totalHoras || course.TotalHoras}h</span>
          </div>

          <h3 className="mb-3">Conteúdo Programático (Módulos e Aulas)</h3>
          {course.modulos && course.modulos.length > 0 ? (
            course.modulos.map((mod: any) => (
              <div className="card mb-3 shadow-sm" key={mod.id || mod.ID_Modulo}>
                <div className="card-header fw-bold bg-white">
                  Módulo {mod.ordem || mod.Ordem}: {mod.titulo || mod.Titulo}
                </div>
                <ul className="list-group list-group-flush">
                  {mod.aulas && mod.aulas.length > 0 ? (
                    mod.aulas.map((aula: any) => (
                      <li className="list-group-item d-flex justify-content-between align-items-center" key={aula.id || aula.ID_Aula}>
                        <span>🎬 {aula.titulo || aula.Titulo} <small className="text-muted">({aula.tipoConteudo || aula.TipoConteudo})</small></span>
                        <span className="badge bg-success rounded-pill">{aula.duracaoMinutos || aula.DuracaoMinutos} min</span>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item text-muted">Nenhuma aula cadastrada neste módulo.</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div className="alert alert-info">Nenhum módulo cadastrado para este curso ainda.</div>
          )}
        </div>
      )}
    </div>
  );
}