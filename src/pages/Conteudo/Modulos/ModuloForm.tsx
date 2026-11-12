import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ModuloService } from "../../../services/conteudo.service";
import { CursoService } from "../../../services/core.service";
import { IModulo } from "../../../models/conteudo.model";
import { ICurso } from "../../../models/core.model";

export function ModuloForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cursos, setCursos] = useState<ICurso[]>([]);

  const [formData, setFormData] = useState<IModulo>({
    id_curso: "",
    titulo: "",
    ordem: 1,
  });

  useEffect(() => {
    CursoService.listarTodos().then(setCursos);

    if (id) {
      ModuloService.listarTodos().then((lista) => {
        const moduloEditado = lista.find((m) => m.id_modulo === id);
        if (moduloEditado) setFormData(moduloEditado);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await ModuloService.salvar(formData);
    navigate("/modulos");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Módulo" : "Novo Módulo"}</h2>

      <form onSubmit={handleSubmit} className="card p-4 mt-3">
        <div className="mb-3">
          <label className="form-label">Vincular ao Curso</label>
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

        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label">Título do Módulo</label>
            <input
              type="text"
              className="form-control"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Ordem (Ex: 1, 2, 3...)</label>
            <input
              type="number"
              className="form-control"
              value={formData.ordem}
              onChange={(e) =>
                setFormData({ ...formData, ordem: Number(e.target.value) })
              }
              min="1"
              required
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-success">
            Guardar Módulo
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/modulos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
