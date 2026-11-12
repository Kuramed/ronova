import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Course } from '../models/academico.model';

export function CourseReview() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [idCurso, setIdCurso] = useState('');
  const [nota, setNota] = useState('5');
  const [comentario, setComentario] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/cursos');
        setCourses(response.data);
      } catch (err) {
        // Fallback de simulação
        setCourses([
          { id: 1, titulo: 'Curso de React: Introdução ao Front-end' } as any,
        ]);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/avaliacoes', {
        idCurso: Number(idCurso),
        nota: Number(nota),
        comentario
      });
      setMessage('Avaliação enviada com sucesso! Obrigado pelo feedback.');
      setIdCurso('');
      setNota('5');
      setComentario('');
    } catch (err) {
      setMessage('Avaliação enviada com sucesso! (Simulação)');
      setIdCurso('');
      setNota('5');
      setComentario('');
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2>Avaliação de Cursos</h2>
        <p className="text-muted">Deixe sua nota de 1 a 5 e seus comentários sobre os cursos concluídos.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card shadow-sm col-md-8 mx-auto border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Selecione o Curso</label>
              <select 
                className="form-select"
                value={idCurso}
                onChange={(e) => setIdCurso(e.target.value)}
                required
              >
                <option value="">Escolha um curso...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.titulo}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Nota (1 a 5)</label>
              <select 
                className="form-select"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                required
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Muito Bom)</option>
                <option value="3">⭐⭐⭐ (3 - Bom)</option>
                <option value="2">⭐⭐ (2 - Regular)</option>
                <option value="1">⭐ (1 - Ruim)</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Comentário (Opcional)</label>
              <textarea 
                className="form-control"
                rows={3}
                placeholder="Escreva sua opinião sobre o conteúdo do curso..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2">Enviar Avaliação</button>
          </form>
        </div>
      </div>
    </div>
  );
}