import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICurso } from "../../../models/core.model";
import { CursoService } from "../../../services/core.service";

export function CursoTable() {
  const [cursos, setCursos] = useState<ICurso[]>([]);

  useEffect(() => {
    CursoService.listarTodos().then(setCursos);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Cursos</h2>
        <Link to="/cursos/novo" className="btn btn-primary">
          Novo Curso
        </Link>
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Título</th>
            <th>Nível</th>
            <th>Horas</th>
            <th>Aulas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id_curso}>
              <td>{curso.titulo}</td>
              <td>
                <span className="badge bg-secondary">{curso.nivel}</span>
              </td>
              <td>{curso.totalHoras}h</td>
              <td>{curso.totalAulas}</td>
              <td>
                <Link
                  to={`/cursos/editar/${curso.id_curso}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    CursoService.excluir(curso.id_curso!).then(() =>
                      window.location.reload(),
                    )
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
