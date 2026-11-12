import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IAvaliacao } from "../../../models/interacao.model";
import { AvaliacaoService } from "../../../services/interacao.service";

export function AvaliacaoTable() {
  const [avaliacoes, setAvaliacoes] = useState<IAvaliacao[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    AvaliacaoService.listarTodas().then(setAvaliacoes);
  };

  const excluir = async (id: string) => {
    if (!window.confirm("Deseja excluir esta avaliação?")) return;

    await AvaliacaoService.excluir(id);
    carregarDados();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Avaliações dos Cursos</h2>

        <Link
          to="/avaliacoes/novo"
          className="btn btn-primary"
        >
          Nova Avaliação
        </Link>
      </div>

      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nota</th>
            <th>Comentário</th>
            <th>ID Curso</th>
            <th>ID Aluno</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {avaliacoes.map((av) => (
            <tr key={av.id_avaliacao}>
              <td>
                <strong>{av.nota}/5</strong>
              </td>

              <td>{av.comentario}</td>

              <td>{av.id_curso}</td>

              <td>{av.id_usuario}</td>

              <td>
                <div className="d-flex gap-2">
                  <Link
                    to={`/avaliacoes/editar/${av.id_avaliacao}`}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </Link>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => excluir(av.id_avaliacao!)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}