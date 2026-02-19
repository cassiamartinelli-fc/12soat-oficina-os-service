import { Given, When, Then, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { OrdemServico } from '../../src/domain/entities/ordem-servico.entity';
import { StatusOrdemServico } from '../../src/domain/value-objects/status-ordem-servico.vo';

setDefaultTimeout(5000);

// Contexto compartilhado entre steps do mesmo cenário
let ordemServico: OrdemServico;
let statusAtual: StatusOrdemServico;

// Helper: simula a transição de status que cada handler faria via use case
function transicionarStatus(novoStatus: StatusOrdemServico): void {
  ordemServico.atualizarStatusManualmente(novoStatus);
  statusAtual = ordemServico.status.obterValor();
}

Before(function () {
  ordemServico = undefined as any;
  statusAtual = undefined as any;
});

// ── Dado ────────────────────────────────────────────────────────────────────

Given('uma Ordem de Serviço em status {string}', function (status: string) {
  ordemServico = OrdemServico.criar({});
  statusAtual = ordemServico.status.obterValor();
  assert.equal(statusAtual, status, `Status inicial esperado: ${status}, obtido: ${statusAtual}`);
});

// ── Quando ──────────────────────────────────────────────────────────────────

When('o evento OrcamentoAprovado é recebido', function () {
  // OrcamentoAprovadoHandler: RECEBIDA → PAGAMENTO_APROVADO
  transicionarStatus(StatusOrdemServico.PAGAMENTO_APROVADO);
});

When('o evento ExecucaoIniciada é recebido', function () {
  // ExecucaoIniciadaHandler: PAGAMENTO_APROVADO → EM_EXECUCAO
  transicionarStatus(StatusOrdemServico.EM_EXECUCAO);
});

When('o evento ExecucaoFinalizada é recebido', function () {
  // ExecucaoFinalizadaHandler: EM_EXECUCAO → FINALIZADA
  transicionarStatus(StatusOrdemServico.FINALIZADA);
});

When('o evento OrcamentoCancelado é recebido', function () {
  // OrcamentoCanceladoHandler: RECEBIDA → CANCELADA (compensação)
  transicionarStatus(StatusOrdemServico.CANCELADA);
});

// ── Então ────────────────────────────────────────────────────────────────────

Then('o status da OS deve ser {string}', function (statusEsperado: string) {
  assert.equal(
    statusAtual,
    statusEsperado,
    `Status esperado: ${statusEsperado}, status atual: ${statusAtual}`,
  );
});
