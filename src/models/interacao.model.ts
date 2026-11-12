import { z } from "zod";

export const MatriculaSchema = z.object({
  id_matricula: z.string().optional(),
  id_usuario: z.string().min(1, "Selecione um usuário"),
  id_curso: z.string().min(1, "Selecione um curso"),
  dataMatricula: z.string().optional(),
  status: z.enum(["Ativa", "Inativa", "Concluida"]).default("Ativa"),
});

export type IMatricula = z.infer<typeof MatriculaSchema>;

export const ProgressoAulaSchema = z.object({
  id_progresso: z.string().optional(),
  id_usuario: z.string().min(1, "Selecione um usuário"),
  id_aula: z.string().min(1, "Selecione uma aula"),
  status: z.enum(["Pendente", "Em Andamento", "Concluida"]).default("Pendente"),
  dataConclusao: z.string().optional(),
});

export type IProgressoAula = z.infer<typeof ProgressoAulaSchema>;

export const AvaliacaoSchema = z.object({
  id_avaliacao: z.string().optional(),
  id_usuario: z.string().min(1, "Selecione um usuário"),
  id_curso: z.string().min(1, "Selecione um curso"),
  nota: z.coerce
    .number()
    .min(1, "A nota mínima é 1")
    .max(5, "A nota máxima é 5"),
  comentario: z.string().optional(),
  dataAvaliacao: z.string().optional(),
});

export type IAvaliacao = z.infer<typeof AvaliacaoSchema>;
