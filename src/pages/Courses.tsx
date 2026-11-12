import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Categoria {
  id_Categoria: number;
  nome: string;
  descricao: string;
}

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  nivel: string;
  totalAulas: number;
  totalHoras: number;
  id_Categoria?: number;
}

export function Courses() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nivel, setNivel] = useState('Iniciante');
  const [totalAulas, setTotalAulas] = useState(0);
  const [totalHoras, setTotalHoras] = useState(0);
  const [idCategoria, setIdCategoria] = useState<number | ''>('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = async () => {
    try {
      const [cursosRes, categoriasRes] = await Promise.all([
        api.get('/cursos'),
        api.get('/categorias').catch(() => ({ data: [] }))
      ]);
      setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : []);
      setCategorias(Array.isArray(categoriasRes.data) ? categoriasRes.data : []);
    } catch (err) {
      setError('Erro ao carregar os dados de cursos.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await api.post('/cursos', {
        titulo,
        descricao,
        nivel,
        totalAulas: Number(totalAulas),
        totalHoras: Number(totalHoras),
        id_Categoria: idCategoria !== '' ? Number(idCategoria) : null
      });

      setSuccessMessage('Curso cadastrado com sucesso!');
      setTitulo('');
      setDescricao('');
      setNivel('Iniciante');
      setTotalAulas(0);
      setTotalHoras(0);
      setIdCategoria('');

      fetchData();
    } catch (err: any) {
      setError('Erro ao cadastrar o curso. Verifique os campos.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestão de Cursos e Categorias</h2>
      <p>Cadastre novos cursos e visualize o catálogo integrado à API.</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Formulário de Cadastro de Curso */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold bg-dark text-white">Cadastrar Novo Curso</div>
        <div className="card-body">
          <form onSubmit={handleCreateCourse}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Título do Curso</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={titulo} 
                  onChange={e => setTitulo(e.target.value)} 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Categoria</label>
                <select 
                  className="form-select" 
                  value={idCategoria} 
                  onChange={e => setIdCategoria(e.target.value === '' ? '' : Number(e.target.value))}
                >
                  <option value="">Selecione uma categoria...</option>
                  {categorias.map(cat => (
                    <option key={cat.id_Categoria} value={cat.id_Categoria}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea 
                className="form-control" 
                rows={2} 
                value={descricao} 
                onChange={e => setDescricao(e.target.value)}
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Nível</label>
                <select className="form-select" value={nivel} onChange={e => setNivel(e.target.value)}>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Total de Aulas</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={totalAulas} 
                  onChange={e => setTotalAulas(Number(e.target.value))} 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Total de Horas</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={totalHoras} 
                  onChange={e => setTotalHoras(Number(e.target.value))} 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Salvar Curso</button>
          </form>
        </div>
      </div>

      {/* Listagem de Cursos */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Cursos Cadastrados no Sistema</div>
        <div className="card-body">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Nível</th>
                <th>Aulas</th>
                <th>Horas</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cursos) && cursos.length > 0 ? (
                cursos.map(curso => (
                  <tr key={curso.id}>
                    <td>{curso.id}</td>
                    <td className="fw-bold">{curso.titulo}</td>
                    <td><span className="badge bg-secondary">{curso.nivel}</span></td>
                    <td>{curso.totalAulas}</td>
                    <td>{curso.totalHoras}h</td>
                    <td>{curso.descricao}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Nenhum curso cadastrado no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}