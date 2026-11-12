import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CursoService, CategoriaService } from "../../../services/core.service";
import { ICurso, ICategoria } from "../../../models/core.model";

export function CursoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  const [formData, setFormData] = useState<ICurso>({
    titulo: "",
    descricao: "",
    id_categoria: "",
    nivel: "Básico",
    totalHoras: 1,
    id_instrutor: "inst-1",
    totalAulas: 0,
  });

  useEffect(() => {
    CategoriaService.listarTodas().then(setCategorias);

    if (id) {
      CursoService.listarTodos().then((lista) => {
        const cursoEditado = lista.find((c) => c.id_curso === id);
        if (cursoEditado) setFormData(cursoEditado);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await CursoService.salvar(formData);
    navigate("/cursos");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Curso" : "Novo Curso"}</h2>

      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">
        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label">Título do Curso</label>
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
            <label className="form-label">Categoria</label>
            <select
              className="form-select"
              value={formData.id_categoria}
              onChange={(e) =>
                setFormData({ ...formData, id_categoria: e.target.value })
              }
              required
            >
              <option value="">Selecione...</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Nível</label>
            <select
              className="form-select"
              value={formData.nivel}
              onChange={(e) =>
                setFormData({ ...formData, nivel: e.target.value as any })
              }
            >
              <option value="Básico">Básico</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Total de Horas</label>
            <input
              type="number"
              className="form-control"
              value={formData.totalHoras}
              onChange={(e) =>
                setFormData({ ...formData, totalHoras: Number(e.target.value) })
              }
              min="1"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            rows={3}
            value={formData.descricao}
            onChange={(e) =>
              setFormData({ ...formData, descricao: e.target.value })
            }
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Guardar Curso
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/cursos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
