import { apiFetch } from "./api";
import { IPlano, IAssinatura, IPagamento } from "../models/negocio.model";

const fixId = (item: any) => {
  if (!item) return item;

  return {
    ...item,
    id_plano: item.id_plano || item.id,
  };
};

export const PlanoService = {
  listarTodos: async (): Promise<IPlano[]> => {
    const data = await apiFetch("/planos");

    return data.map((item: any) => fixId(item));
  },

  salvar: (plano: IPlano): Promise<IPlano> => {
    const id = plano.id_plano;

    return apiFetch(
      id ? `/planos/${id}` : "/planos",
      {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(plano),
      }
    );
  },

  excluir: (id: string): Promise<void> =>
    apiFetch(`/planos/${id}`, {
      method: "DELETE",
    }),
};

export const AssinaturaService = {
  listarTodas: (): Promise<IAssinatura[]> =>
    apiFetch("/assinaturas"),

  atualizarStatus: (
    assinatura: IAssinatura
  ): Promise<IAssinatura> => {
    return apiFetch(
      `/assinaturas/${assinatura.id_assinatura}`,
      {
        method: "PUT",
        body: JSON.stringify(assinatura),
      }
    );
  },
};

export const PagamentoService = {
  registrarPagamento: (
    pagamento: IPagamento
  ): Promise<IPagamento> => {
    return apiFetch("/pagamentos", {
      method: "POST",
      body: JSON.stringify(pagamento),
    });
  },
};