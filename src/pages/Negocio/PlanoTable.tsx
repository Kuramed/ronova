import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IPlano } from "../../models/negocio.model";
import { PlanoService } from "../../services/negocio.service";

export function PlanoTable() {
  const [planos, setPlanos] = useState<IPlano[]>([]);

  useEffect(() => {
    PlanoService.listarTodos().then(setPlanos);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Planos de Assinatura</h2>
        <Link to="/planos/novo" className="btn btn-primary">
          Novo Plano
        </Link>
      </div>

      <div className="row">
        {planos.map((plano) => (
          <div className="col-md-4 mb-4" key={plano.id_plano}>
            <div className="card h-100 shadow-sm border-primary">
              <div className="card-body text-center">
                <h4 className="card-title">{plano.nome}</h4>
                <h2 className="text-primary my-3">{plano.preco}€</h2>
                <p className="text-muted">
                  Duração: {plano.duracaoMeses} meses
                </p>
                <p className="card-text">{plano.descricao}</p>
              </div>
              <div className="card-footer bg-transparent d-flex justify-content-center gap-2">
                <Link
                  to={`/planos/editar/${plano.id_plano}`}
                  className="btn btn-outline-warning btn-sm"
                >
                  Editar
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={async () => {
                    if (!window.confirm("Deseja eliminar este plano?")) return;

                    await PlanoService.excluir(plano.id_plano!);

                    setPlanos(
                      planos.filter((p) => p.id_plano !== plano.id_plano),
                    );
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
