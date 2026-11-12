import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MatriculaService } from "../../../services/interacao.service";
import { CursoService, UsuarioService } from "../../../services/core.service";
import { IMatricula } from "../../../models/interacao.model";
import { ICurso, IUsuario } from "../../../models/core.model";

export function MatriculaForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);

  const [formData, setFormData] = useState<IMatricula>({
    id_usuario: "",
    id_curso: "",
    status: "Ativa",
  });

  useEffect(() => {
    CursoService.listarTodos().then(setCursos);
    UsuarioService.listarTodos().then(setUsuarios);

    if (id) {
  MatriculaService.buscarPorId(id)
    .then(setFormData)
    .catch(console.error);
}
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await MatriculaService.salvar(formData);
    navigate("/matriculas");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Matrícula" : "Nova Matrícula"}</h2>
      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Aluno</label>
            <select
              className="form-select"
              value={formData.id_usuario}
              onChange={(e) =>
                setFormData({ ...formData, id_usuario: e.target.value })
              }
              required
            >
              <option value="">Selecione o Aluno...</option>
              {usuarios
                .filter((u) => u.tipo === "Aluno")
                .map((aluno) => (
                  <option key={aluno.id_usuario} value={aluno.id_usuario}>
                    {aluno.nomeCompleto}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Curso</label>
            <select
              className="form-select"
              value={formData.id_curso}
              onChange={(e) =>
                setFormData({ ...formData, id_curso: e.target.value })
              }
              required
            >
              <option value="">Selecione o Curso...</option>
              {cursos.map((curso) => (
                <option key={curso.id_curso} value={curso.id_curso}>
                  {curso.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Status da Matrícula</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as any })
            }
          >
            <option value="Ativa">Ativa</option>
            <option value="Inativa">Inativa</option>
            <option value="Concluida">Concluída</option>
          </select>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/matriculas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
