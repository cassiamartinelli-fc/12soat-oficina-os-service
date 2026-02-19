# language: pt

Funcionalidade: Fluxo completo da Saga de Ordem de Serviço
  Como sistema de gestão da oficina
  Quero coordenar o fluxo de uma OS entre os microsserviços via eventos
  Para garantir consistência transacional distribuída

  Cenário: Fluxo de aprovação e execução bem-sucedido
    Dado uma Ordem de Serviço em status "recebida"
    Quando o evento OrcamentoAprovado é recebido
    Então o status da OS deve ser "pagamento_aprovado"
    Quando o evento ExecucaoIniciada é recebido
    Então o status da OS deve ser "em_execucao"
    Quando o evento ExecucaoFinalizada é recebido
    Então o status da OS deve ser "finalizada"

  Cenário: Compensação por orçamento cancelado
    Dado uma Ordem de Serviço em status "recebida"
    Quando o evento OrcamentoCancelado é recebido
    Então o status da OS deve ser "cancelada"
