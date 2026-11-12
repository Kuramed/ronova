import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AvaliacaoService } from "../../../services/interacao.service";
import { CursoService, UsuarioService } from "../../../services/core.service";
import { IAvaliacao } from "../../../models/interacao.model";
import { ICurso, IUsuario } from "../../../models/core.model";

export function AvaliacaoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);

  const [formData, setFormData] = useState<IAvaliacao>({
    id_usuario: "",
    id_curso: "",
    nota: 5,
    comentario: "",
  });

  useEffect(() => {
    CursoService.listarTodos().then(setCursos);
    UsuarioService.listarTodos().then(setUsuarios);

    if (id) {
      AvaliacaoService.listarTodas().then((lista) => {
        const item = lista.find(
          (a) =>
            String(a.id_avaliacao) === String(id)
        );

        if (item) {
          setFormData(item);
        }
      });
    }
    if (id) {
  AvaliacaoService.buscarPorId(id)
    .then(setFormData)
    .catch(console.error);
}
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await AvaliacaoService.salvar(formData);

    navigate("/avaliacoes");
  };

  return (
    <div className="container mt-4">
      <h2>
        {id ? "Editar Avaliação" : "Nova Avaliação"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="card p-4 mt-3 shadow-sm"
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Aluno
            </label>

            <select
              className="form-select"
              value={formData.id_usuario}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  id_usuario: e.target.value,
                })
              }
              required
            >
              <option value="">
                Selecione...
              </option>

              {usuarios
                .filter(
                  (u) => u.tipo === "Aluno"
                )
                .map((aluno) => (
                  <option
                    key={aluno.id_usuario}
                    value={aluno.id_usuario}
                  >
                    {aluno.nomeCompleto}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Curso
            </label>

            <select
              className="form-select"
              value={formData.id_curso}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  id_curso: e.target.value,
                })
              }
              required
            >
              <option value="">
                Selecione...
              </option>

              {cursos.map((curso) => (
                <option
                  key={curso.id_curso}
                  value={curso.id_curso}
                >
                  {curso.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Nota
          </label>

          <input
            type="number"
            className="form-control"
            min={1}
            max={5}
            value={formData.nota}
            onChange={(e) =>
              setFormData({
                ...formData,
                nota: Number(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Comentário
          </label>

          <textarea
            className="form-control"
            rows={3}
            value={formData.comentario}
            onChange={(e) =>
              setFormData({
                ...formData,
                comentario: e.target.value,
              })
            }
          />
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-success"
          >
            Guardar
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate("/avaliacoes")
            }
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}