import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function CourseManagement() {
  // Estados de Cursos
  const [courses, setCourses] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [nivel, setNivel] = useState('Iniciante');
  const [totalAulas, setTotalAulas] = useState('10');
  const [totalHoras, setTotalHoras] = useState('5');
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  // Estados de Categorias
  const [categories, setCategories] = useState<any[]>([]);
  const [catNome, setCatNome] = useState('');
  const [catDescricao, setCatDescricao] = useState('');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, catsRes] = await Promise.all([
        api.get('/cursos').catch(() => ({ data: [] })),
        api.get('/categorias').catch(() => ({ data: [] })),
      ]);
      setCourses(coursesRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      setError('Erro ao carregar os dados.');
    }
  };

  // --- GESTÃO DE CATEGORIAS ---
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const payload = { nome: catNome, descricao: catDescricao };
      if (editingCatId) {
        await api.patch(`/categorias/${editingCatId}`, payload);
        setSuccess('Categoria atualizada com sucesso!');
      } else {
        await api.post('/categorias', payload);
        setSuccess('Categoria criada com sucesso!');
      }
      setCatNome('');
      setCatDescricao('');
      setEditingCatId(null);
      fetchData();
    } catch (err) {
      setError('Erro ao salvar categoria.');
    }
  };

  const handleEditCategory = (cat: any) => {
    setEditingCatId(cat.id_categoria || cat.id);
    setCatNome(cat.nome || cat.Nome || '');
    setCatDescricao(cat.descricao || cat.Descricao || '');
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`/categorias/${id}`);
        setSuccess('Categoria excluída com sucesso!');
        fetchData();
      } catch (err) {
        setError('Erro ao excluir categoria.');
      }
    }
  };

  // --- GESTÃO DE CURSOS ---
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const payload = {
        titulo,
        descricao,
        nivel,
        totalAulas: Number(totalAulas),
        totalHoras: Number(totalHoras),
        idCategoria: Number(idCategoria),
      };

      if (editingCourseId) {
        await api.patch(`/cursos/${editingCourseId}`, payload);
        setSuccess('Curso atualizado com sucesso!');
      } else {
        await api.post('/cursos', payload);
        setSuccess('Curso criado com sucesso!');
      }

      resetCourseForm();
      fetchData();
    } catch (err) {
      setError('Erro ao salvar o curso.');
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourseId(course.id || course.id_curso);
    setTitulo(course.titulo || course.Titulo || '');
    setDescricao(course.descricao || course.Descricao || '');
    setNivel(course.nivel || course.Nivel || 'Iniciante');
    setTotalAulas(String(course.totalAulas || course.TotalAulas || 10));
    setTotalHoras(String(course.totalHoras || course.TotalHoras || 5));
    setIdCategoria(course.idCategoria || course.id_categoria || '');
  };

  const handleDeleteCourse = async (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este curso?')) {
      try {
        await api.delete(`/cursos/${id}`);
        setSuccess('Curso excluído com sucesso!');
        fetchData();
      } catch (err) {
        setError('Erro ao excluir o curso.');
      }
    }
  };

  const resetCourseForm = () => {
    setEditingCourseId(null);
    setTitulo('');
    setDescricao('');
    setNivel('Iniciante');
    setTotalAulas('10');
    setTotalHoras('5');
    setIdCategoria('');
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Gestão Acadêmica: Cursos e Categorias</h2>
      <p className="text-muted">Cadastre, edite e organize categorias e cursos da plataforma.</p>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* SEÇÃO DE CATEGORIAS */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-secondary text-white fw-bold">
          {editingCatId ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}
        </div>
        <div className="card-body">
          <form onSubmit={handleCategorySubmit}>
            <div className="row">
              <div className="col-md-5 mb-3">
                <label className="form-label">Nome da Categoria</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={catNome} 
                  onChange={e => setCatNome(e.target.value)} 
                  required 
                />
              </div>
              <div className="col-md-7 mb-3">
                <label className="form-label">Descrição da Categoria</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={catDescricao} 
                  onChange={e => setCatDescricao(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className={`btn ${editingCatId ? 'btn-warning' : 'btn-secondary'} btn-sm`}>
                {editingCatId ? 'Atualizar Categoria' : 'Salvar Categoria'}
              </button>
              {editingCatId && (
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setEditingCatId(null); setCatNome(''); setCatDescricao(''); }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* Tabela de Categorias */}
          <div className="table-responsive mt-3">
            <table className="table table-sm table-bordered align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th className="text-center" style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map(cat => {
                    const id = cat.id_categoria || cat.id;
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td className="fw-bold">{cat.nome || cat.Nome}</td>
                        <td>{cat.descricao || cat.Descricao}</td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-outline-warning me-1 py-0 px-2" onClick={() => handleEditCategory(cat)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => handleDeleteCategory(id)}>Excluir</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={4} className="text-center text-muted small">Nenhuma categoria cadastrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE CURSOS */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-bold">
          {editingCourseId ? 'Editar Curso' : 'Cadastrar Novo Curso'}
        </div>
        <div className="card-body">
          <form onSubmit={handleCourseSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Título do Curso</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={titulo} 
                  onChange={e => setTitulo(e.target.value)} 
                  required 
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Categoria</label>
                <select 
                  className="form-select" 
                  value={idCategoria} 
                  onChange={e => setIdCategoria(e.target.value)} 
                  required
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id_categoria || cat.id} value={cat.id_categoria || cat.id}>
                      {cat.nome || cat.Nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Nível</label>
                <select 
                  className="form-select" 
                  value={nivel} 
                  onChange={e => setNivel(e.target.value)}
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
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
                required 
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Total de Aulas</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={totalAulas} 
                  onChange={e => setTotalAulas(e.target.value)} 
                  required 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Carga Horária (Horas)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={totalHoras} 
                  onChange={e => setTotalHoras(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className={`btn ${editingCourseId ? 'btn-warning' : 'btn-primary'} w-100`}>
                {editingCourseId ? 'Atualizar Curso' : 'Salvar Curso'}
              </button>
              {editingCourseId && (
                <button type="button" className="btn btn-secondary" onClick={resetCourseForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Tabela de Cursos */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Cursos Cadastrados</div>
        <div className="card-body">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Nível</th>
                <th>Aulas / Horas</th>
                <th className="text-center" style={{ width: '180px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(courses) && courses.length > 0 ? (
                courses.map(course => {
                  const id = course.id || course.id_curso;
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td className="fw-bold">{course.titulo || course.Titulo}</td>
                      <td>
                        <span className="badge bg-secondary">{course.nivel || course.Nivel || 'Iniciante'}</span>
                      </td>
                      <td>{course.totalAulas || 0} aulas ({course.totalHoras || 0}h)</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditCourse(course)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCourse(id)}>Excluir</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={5} className="text-center text-muted">Nenhum curso cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}