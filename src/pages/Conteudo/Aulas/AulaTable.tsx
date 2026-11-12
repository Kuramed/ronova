import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IAula } from "../../../models/conteudo.model";
import { AulaService } from "../../../services/conteudo.service";

export function AulaTable() {
  const [aulas, setAulas] = useState<IAula[]>([]);

  useEffect(() => {
    AulaService.listarTodas().then(setAulas);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Aulas</h2>
        <Link to="/aulas/novo" className="btn btn-primary">
          Nova Aula
        </Link>
      </div>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Ordem</th>
            <th>Título da Aula</th>
            <th>Duração (Minutos)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aulas.map((aula) => (
            <tr key={aula.id_aula}>
              <td>{aula.ordem}</td>
              <td>{aula.titulo}</td>
              <td>{aula.duracaoMinutos} min</td>
              <td>
                <Link
                  to={`/aulas/editar/${aula.id_aula}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    AulaService.excluir(aula.id_aula!).then(() =>
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
