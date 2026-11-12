import { apiFetch } from "./api";
import { IAvaliacao, IMatricula } from "../models/interacao.model";

const fixId = (item: any, idName: string) => {
  if (!item) return item;

  return {
    ...item,
    [idName]: item[idName] || item.id,
  };
};

export const MatriculaService = {
  listarTodas: async (): Promise<IMatricula[]> => {
    const data = await apiFetch("/matriculas");
    return data.map((item: any) => fixId(item, "id_matricula"));
  },

  buscarPorId: async (id: string): Promise<IMatricula> => {
    const data = await apiFetch(`/matriculas/${id}`);
    return fixId(data, "id_matricula");
  },

  salvar: (matricula: IMatricula): Promise<IMatricula> => {
    const id = matricula.id_matricula;

    return apiFetch(
      id ? `/matriculas/${id}` : "/matriculas",
      {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(matricula),
      }
    );
  },

  excluir: (id: string): Promise<void> =>
    apiFetch(`/matriculas/${id}`, {
      method: "DELETE",
    }),
};

export const AvaliacaoService = {
  listarTodas: async (): Promise<IAvaliacao[]> => {
    const data = await apiFetch("/avaliacoes");

    return data.map((item: any) =>
      fixId(item, "id_avaliacao")
    );
  },

  listarPorCurso: async (
    id_curso: string
  ): Promise<IAvaliacao[]> => {
    const url = id_curso
      ? `/avaliacoes?id_curso=${id_curso}`
      : "/avaliacoes";

    const data = await apiFetch(url);

    return data.map((item: any) =>
      fixId(item, "id_avaliacao")
    );
  },

  buscarPorId: async (id: string): Promise<IAvaliacao> => {
    const data = await apiFetch(`/avaliacoes/${id}`);
    return fixId(data, "id_avaliacao");
  },

  salvar: (avaliacao: IAvaliacao): Promise<IAvaliacao> => {
    const id = avaliacao.id_avaliacao;

    return apiFetch(
      id ? `/avaliacoes/${id}` : "/avaliacoes",
      {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(avaliacao),
      }
    );
  },

  excluir: (id: string): Promise<void> =>
    apiFetch(`/avaliacoes/${id}`, {
      method: "DELETE",
    }),
};