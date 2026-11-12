import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ITrilha } from "../../../models/curadoria.model";
import { TrilhaService } from "../../../services/curadoria.service";

export function TrilhaTable() {
  const [trilhas, setTrilhas] = useState<ITrilha[]>([]);

  useEffect(() => {
    TrilhaService.listarTodas().then(setTrilhas);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Trilhas de Aprendizagem</h2>
        <Link to="/trilhas/novo" className="btn btn-primary">
          Nova Trilha
        </Link>
      </div>

      <table className="table table-striped border shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {trilhas.map((trilha) => (
            <tr key={trilha.id_trilha}>
              <td>
                <strong>{trilha.titulo}</strong>
              </td>
              <td className="small text-muted">{trilha.descricao}</td>
              <td>
                <Link
                  to={`/trilhas/editar/${trilha.id_trilha}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={async () => {
                    if (!trilha.id_trilha) return;

                    await TrilhaService.excluir(trilha.id_trilha);

                    const listaAtualizada = await TrilhaService.listarTodas();
                    setTrilhas(listaAtualizada);
                  }}
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
