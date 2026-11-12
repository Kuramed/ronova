import { z } from "zod";

export const PlanoSchema = z.object({
  id_plano: z.string().optional(),
  nome: z.string().min(3, "O nome do plano é obrigatório"),
  preco: z.coerce.number().min(0, "O preço não pode ser negativo"),
  duracaoMeses: z.coerce.number().min(1, "A duração deve ser de pelo menos 1 mês"),
  descricao: z.string().optional(),
});

export type IPlano = z.infer<typeof PlanoSchema>;

// Se preferir usar o formato de interface simples compatível com o Checkout.tsx:
export interface Plan {
  idPlano: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMeses: number;
}
export const AssinaturaSchema = z.object({
  id_assinatura: z.string().optional(),
  id_usuario: z.string().min(1, "O ID do usuário é obrigatório"),
  id_plano: z.string().min(1, "O ID do plano é obrigatório"),
  status: z.enum(["Ativa", "Cancelada", "Expirada"]).default("Ativa"),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export type IAssinatura = z.infer<typeof AssinaturaSchema>;

export const PagamentoSchema = z.object({
  id_pagamento: z.string().optional(),
  id_assinatura: z.string().min(1, "A assinatura é obrigatória"),
  valor: z.coerce.number().min(0, "O valor não pode ser negativo"),
  metodoPagamento: z.enum(["Cartão de Crédito", "Pix", "Boleto"]),
  id_transacao_gateway: z.string().min(1, "O ID da transação é obrigatório"),
  dataPagamento: z.string().optional(),
});

export type IPagamento = z.infer<typeof PagamentoSchema>;