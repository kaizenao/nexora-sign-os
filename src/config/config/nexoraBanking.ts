/**
 * Coordenadas bancárias OFICIAIS da Nexora para liquidação em Kwanzas.
 *
 * ─── Porque isto é um ficheiro só ────────────────────────────────────────────
 * Os dados bancários apareciam escritos à mão em mais do que um sítio e
 * divergiram: o painel do ANUNCIANTE (pagamento de campanha) mostrava o IBAN
 * AO06 0040 0000 9283 1829 1014 9 (BAI) e o painel do CLIENTE (pagamento do
 * plano SaaS) mostrava outro IBAN, outro beneficiário e outra referência. Quem
 * pagava para o sítio errado não via o plano ativado.
 *
 * Passam a existir numa única fonte: qualquer correção futura faz-se aqui e
 * TODOS os ecrãs de pagamento passam a mostrar exactamente o mesmo.
 */
export const NEXORA_BANKING = {
  beneficiary: 'NEXORA MEDIA ANGOLA LDA',
  bankName: 'Banco Angolano de Investimentos (BAI)',
  iban: 'AO06 0040 0000 9283 1829 1014 9',
  multicaixaReference: '928 391 002',
  entity: '00921',
  currency: 'Kwanza (AOA)',
} as const;
