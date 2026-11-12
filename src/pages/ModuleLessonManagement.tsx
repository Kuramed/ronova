import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ModuleLessonManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  
  // Estados de Módulos
  const [modules, setModules] = useState<any[]>([]);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleOrder, setModuleOrder] = useState('1');
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);

  // Estados de Aulas (Ajustado de lessons para aulas)
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [aulas, setAulas] = useState<any[]>([]);
  const [aulaTitulo, setAulaTitulo] = useState('');
  const [tipoConteudo, setTipoConteudo] = useState('Vídeo');
  const [urlConteudo, setUrlConteudo] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState('10');
  const [aulaOrdem, setAulaOrdem] = useState('1');
  const [editingAulaId, setEditingAulaId] = useState<number | null>(null);

  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/cursos');
      setCourses(response.data);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    } else {
      setModules([]);
      setAulas([]);
    }
  }, [selectedCourseId]);

  const fetchModules = async (courseId: string) => {
    try {
      const res = await api.get(`/cursos/${courseId}/modulos`).catch(() => api.get('/modulos'));
      const allMods = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const filtered = allMods.filter((m: any) => String(m.idCurso || m.id_curso) === String(courseId));
      setModules(filtered);
    } catch (err) {
      setModules([]);
    }
  };

  useEffect(() => {
    if (selectedModuleId) {
      fetchAulas(selectedModuleId);
    } else {
      setAulas([]);
    }
  }, [selectedModuleId]);

  const fetchAulas = async (moduleId: string) => {
    try {
      const res = await api.get(`/modulos/${moduleId}/aulas`).catch(() => api.get('/aulas'));
      const allAulas = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const filtered = allAulas.filter((l: any) => String(l.idModulo || l.id_modulo || l.ID_Modulo) === String(moduleId));
      setAulas(filtered);
    } catch (err) {
      setAulas([]);
    }
  };

  // --- MÓDULOS: CRUD ---
  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setMessage({ type: 'danger', text: 'Selecione um curso primeiro.' });
      return;
    }

    try {
      const payload = {
        titulo: moduleTitle,
        ordem: Number(moduleOrder),
        idCurso: Number(selectedCourseId),
      };

      if (editingModuleId) {
        await api.patch(`/modulos/${editingModuleId}`, payload);
        setMessage({ type: 'success', text: 'Módulo atualizado com sucesso!' });
      } else {
        await api.post('/modulos', payload);
        setMessage({ type: 'success', text: 'Módulo criado com sucesso!' });
      }

      setModuleTitle('');
      setModuleOrder('1');
      setEditingModuleId(null);
      fetchModules(selectedCourseId);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Erro ao salvar módulo.' });
    }
  };

  const handleEditModule = (mod: any) => {
    setEditingModuleId(mod.id || mod.ID_Modulo);
    setModuleTitle(mod.titulo || mod.Titulo || '');
    setModuleOrder(String(mod.ordem || mod.Ordem || 1));
  };

  const handleDeleteModule = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este módulo?')) {
      try {
        await api.delete(`/modulos/${id}`);
        setMessage({ type: 'success', text: 'Módulo excluído com sucesso!' });
        fetchModules(selectedCourseId);
      } catch (err) {
        setMessage({ type: 'danger', text: 'Erro ao excluir módulo.' });
      }
    }
  };

  // --- AULAS: CRUD ---
  const handleAulaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) {
      setMessage({ type: 'danger', text: 'Selecione um módulo para adicionar a aula.' });
      return;
    }

    try {
      const payload = {
        titulo: aulaTitulo,
        tipoConteudo,
        urlConteudo,
        duracaoMinutos: Number(duracaoMinutos),
        ordem: Number(aulaOrdem),
        idModulo: Number(selectedModuleId),
      };

      if (editingAulaId) {
        await api.patch(`/aulas/${editingAulaId}`, payload);
        setMessage({ type: 'success', text: 'Aula atualizada com sucesso!' });
      } else {
        await api.post('/aulas', payload);
        setMessage({ type: 'success', text: 'Aula criada com sucesso!' });
      }

      setAulaTitulo('');
      setUrlConteudo('');
      setDuracaoMinutos('10');
      setAulaOrdem('1');
      setEditingAulaId(null);
      fetchAulas(selectedModuleId);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Erro ao salvar aula.' });
    }
  };

  const handleEditAula = (aula: any) => {
    setEditingAulaId(aula.id || aula.ID_Aula);
    setAulaTitulo(aula.titulo || aula.Titulo || '');
    setTipoConteudo(aula.tipoConteudo || aula.TipoConteudo || 'Vídeo');
    setUrlConteudo(aula.urlConteudo || aula.URL_Conteudo || '');
    setDuracaoMinutos(String(aula.duracaoMinutos || aula.DuracaoMinutos || 10));
    setAulaOrdem(String(aula.ordem || aula.Ordem || 1));
  };

  const handleDeleteAula = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      try {
        await api.delete(`/aulas/${id}`);
        setMessage({ type: 'success', text: 'Aula excluída com sucesso!' });
        fetchAulas(selectedModuleId);
      } catch (err) {
        setMessage({ type: 'danger', text: 'Erro ao excluir aula.' });
      }
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Gestão de Conteúdo: Módulos & Aulas</h2>
      <p className="text-muted">Organize a hierarquia acadêmica dos cursos da plataforma[cite: 9].</p>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      {/* Seleção de Curso */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <label className="form-label fw-bold">1. Selecione o Curso</label>
          <select 
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedModuleId('');
            }}
          >
            <option value="">Escolha um curso...</option>
            {courses.map((course: any) => (
              <option key={course.id || course.id_curso} value={course.id || course.id_curso}>
                {course.titulo || course.Titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCourseId && (
        <div className="row">
          {/* COLUNA DE MÓDULOS */}
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-dark text-white fw-bold">
                {editingModuleId ? 'Editar Módulo' : 'Adicionar Módulo'}
              </div>
              <div className="card-body">
                <form onSubmit={handleModuleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Título do Módulo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={moduleTitle} 
                      onChange={e => setModuleTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ordem Sequencial</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={moduleOrder} 
                      onChange={e => setModuleOrder(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className={`btn ${editingModuleId ? 'btn-warning' : 'btn-primary'} w-100 btn-sm`}>
                      {editingModuleId ? 'Atualizar Módulo' : 'Salvar Módulo'}
                    </button>
                    {editingModuleId && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditingModuleId(null); setModuleTitle(''); }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                {/* Tabela de Módulos */}
                <div className="table-responsive mt-3">
                  <table className="table table-sm table-bordered align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Ordem</th>
                        <th>Título</th>
                        <th className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.length > 0 ? (
                        modules.map(mod => {
                          const id = mod.id || mod.ID_Modulo;
                          const isSelected = String(selectedModuleId) === String(id);
                          return (
                            <tr key={id} className={isSelected ? 'table-active' : ''}>
                              <td>{mod.ordem || mod.Ordem}</td>
                              <td 
                                className="fw-bold text-primary" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedModuleId(id)}
                                title="Clique para gerenciar as aulas deste módulo"
                              >
                                {mod.titulo || mod.Titulo} {isSelected && ' (Selecionado)'}
                              </td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-outline-warning me-1 py-0 px-1" onClick={() => handleEditModule(mod)}>Editar</button>
                                <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => handleDeleteModule(id)}>Excluir</button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan={3} className="text-center text-muted small">Nenhum módulo cadastrado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DE AULAS */}
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-secondary text-white fw-bold">
                {editingAulaId ? 'Editar Aula' : 'Adicionar Aula'} {selectedModuleId ? `(Módulo ID: ${selectedModuleId})` : ''}
              </div>
              <div className="card-body">
                {!selectedModuleId ? (
                  <div className="alert alert-warning small">Clique em um módulo na tabela ao lado para gerenciar as suas aulas.</div>
                ) : (
                  <>
                    <form onSubmit={handleAulaSubmit}>
                      <div className="mb-2">
                        <label className="form-label small">Título da Aula</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          value={aulaTitulo} 
                          onChange={e => setAulaTitulo(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <label className="form-label small">Tipo de Conteúdo</label>
                          <select className="form-select form-select-sm" value={tipoConteudo} onChange={e => setTipoConteudo(e.target.value)}>
                            <option value="Vídeo">Vídeo</option>
                            <option value="Texto">Texto</option>
                            <option value="Quiz">Quiz</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-2">
                          <label className="form-label small">Duração (Min)</label>
                          <input 
                            type="number" 
                            className="form-control form-control-sm" 
                            value={duracaoMinutos} 
                            onChange={e => setDuracaoMinutos(e.target.value)} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">URL do Conteúdo</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          value={urlConteudo} 
                          onChange={e => setUrlConteudo(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small">Ordem</label>
                        <input 
                          type="number" 
                          className="form-control form-control-sm" 
                          value={aulaOrdem} 
                          onChange={e => setAulaOrdem(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className={`btn ${editingAulaId ? 'btn-warning' : 'btn-primary'} w-100 btn-sm`}>
                          {editingAulaId ? 'Atualizar Aula' : 'Salvar Aula'}
                        </button>
                        {editingAulaId && (
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditingAulaId(null); setAulaTitulo(''); }}>
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Tabela de Aulas */}
                    <div className="table-responsive mt-3">
                      <table className="table table-sm table-bordered align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Ord</th>
                            <th>Título</th>
                            <th>Tipo</th>
                            <th className="text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {aulas.length > 0 ? (
                            aulas.map(aula => {
                              const id = aula.id || aula.ID_Aula;
                              return (
                                <tr key={id}>
                                  <td>{aula.ordem || aula.Ordem}</td>
                                  <td className="fw-bold">{aula.titulo || aula.Titulo}</td>
                                  <td><span className="badge bg-info text-dark">{aula.tipoConteudo || aula.TipoConteudo}</span></td>
                                  <td className="text-center">
                                    <button className="btn btn-sm btn-outline-warning me-1 py-0 px-1" onClick={() => handleEditAula(aula)}>Editar</button>
                                    <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => handleDeleteAula(id)}>Excluir</button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr><td colSpan={4} className="text-center text-muted small">Nenhuma aula cadastrada neste módulo.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}