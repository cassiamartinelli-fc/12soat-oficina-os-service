export interface BaseEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  timestamp: string;
  version: number;
  source: string;
}

export interface OSCriadaEvent extends BaseEvent {
  eventType: 'OS_CRIADA';
  source: 'os-service';
  payload: {
    osId: string;
    clienteId: string;
    veiculoId: string;
    status: 'recebida';
    valorTotal: number;
  };
}

export interface OrcamentoAprovadoEvent extends BaseEvent {
  eventType: 'ORCAMENTO_APROVADO';
  source: 'billing-service';
  payload: {
    osId: string;
    orcamentoId: string;
    valorTotal: number;
    pagamentoId: string;
    statusPagamento: string;
  };
}

export interface OrcamentoCanceladoEvent extends BaseEvent {
  eventType: 'ORCAMENTO_CANCELADO';
  source: 'billing-service';
  payload: {
    osId: string;
    orcamentoId: string;
    motivo: string;
  };
}

export interface ExecucaoIniciadaEvent extends BaseEvent {
  eventType: 'EXECUCAO_INICIADA';
  source: 'production-service';
  payload: {
    osId: string;
    execucaoId: string;
    dataInicio: string;
  };
}

export interface ExecucaoFinalizadaEvent extends BaseEvent {
  eventType: 'EXECUCAO_FINALIZADA';
  source: 'production-service';
  payload: {
    osId: string;
    execucaoId: string;
    dataInicio: string;
    dataFim: string;
    duracaoDias: number;
  };
}

export type SagaEvent =
  | OSCriadaEvent
  | OrcamentoAprovadoEvent
  | OrcamentoCanceladoEvent
  | ExecucaoIniciadaEvent
  | ExecucaoFinalizadaEvent;
