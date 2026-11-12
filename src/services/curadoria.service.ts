import { apiFetch } from "./api";
import { ITrilha, ICertificado } from "../models/curadoria.model";

const fixId = (item: any) => {
  if (!item) return item;

  return {
    ...item,
    id_trilha: item.id_trilha || item.id,
  };
};

export const TrilhaService = {
  listarTodas: async (): Promise<ITrilha[]> => {
    const data = await apiFetch("/trilhas");

    return data.map((item: any) => fixId(item));
  },

  salvar: (trilha: ITrilha): Promise<ITrilha> => {
    const id = trilha.id_trilha;

    return apiFetch(
      id ? `/trilhas/${id}` : "/trilhas",
      {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(trilha),
      }
    );
  },

  excluir: (id: string): Promise<void> =>
    apiFetch(`/trilhas/${id}`, {
      method: "DELETE",
    }),
};

export const CertificadoService = {
  listarTodos: (): Promise<ICertificado[]> =>
    apiFetch("/certificados"),

  emitir: (certificado: ICertificado): Promise<ICertificado> => {
    return apiFetch("/certificados", {
      method: "POST",
      body: JSON.stringify(certificado),
    });
  },
};