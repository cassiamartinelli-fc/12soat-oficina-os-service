import { OrdemServico } from "./ordem-servico.entity";
import { BusinessRuleException } from "../../shared/exceptions/domain.exception";
import {
  ClienteId,
  OrdemServicoId,
  VeiculoId,
} from "../../shared/types/entity-id";
import { StatusOrdemServico } from "../value-objects/status-ordem-servico.vo";
import { Preco } from "../value-objects/preco.vo";

describe("OrdemServico Entity", () => {
  const clienteId = "cliente-123";
  const veiculoId = "veiculo-456";

  describe("criar", () => {
    it("deve criar ordem com status inicial e valor zero", () => {
      const ordem = OrdemServico.criar({});

      expect(ordem.status.isRecebida()).toBe(true);
      expect(ordem.valorTotal.obterValor()).toBe(0);
      expect(ordem.createdAt).toBeInstanceOf(Date);
      expect(ordem.updatedAt).toBeInstanceOf(Date);
    });

    it("deve criar com cliente e veículo", () => {
      const ordem = OrdemServico.criar({
        clienteId,
        veiculoId,
      });

      expect(ordem.temCliente()).toBe(true);
      expect(ordem.temVeiculo()).toBe(true);
    });
  });

  describe("regras de negócio", () => {
    it("não deve permitir veículo sem cliente na reconstituição", () => {
      expect(() =>
        OrdemServico.reconstituir({
          id: OrdemServicoId.gerar(),
          status: OrdemServico.criar({}).status,
          valorTotal: Preco.zero(),
          clienteId: undefined,
          veiculoId: VeiculoId.criar(veiculoId),
          periodoExecucao: OrdemServico.criar({}).periodoExecucao,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow(BusinessRuleException);
    });

    it("não deve permitir definir veículo antes do cliente", () => {
      const ordem = OrdemServico.criar({});

      expect(() => ordem.definirVeiculo(veiculoId)).toThrow(
        BusinessRuleException,
      );
    });
  });

  describe("definirCliente e definirVeiculo", () => {
    it("deve transicionar para EM_DIAGNOSTICO ao ter cliente e veículo", () => {
      const ordem = OrdemServico.criar({});

      ordem.definirCliente(clienteId);
      ordem.definirVeiculo(veiculoId);

      expect(ordem.status.isEmDiagnostico()).toBe(true);
    });
  });

  describe("aprovação e rejeição", () => {
    function criarOrdemEmAguardandoAprovacao(): OrdemServico {
      const ordem = OrdemServico.criar({});

      ordem.definirCliente("cliente-1");
      ordem.definirVeiculo("veiculo-1");
      ordem.atualizarValorTotal(100);

      return ordem;
    }

    it("deve lançar exceção ao aprovar orçamento (transição manual inválida)", () => {
      const ordem = criarOrdemEmAguardandoAprovacao();

      expect(() => ordem.aprovarOrcamento()).toThrow();
    });

    it("deve rejeitar orçamento corretamente", () => {
      const ordem = criarOrdemEmAguardandoAprovacao();

      ordem.rejeitarOrcamento();

      expect(ordem.status.isCancelada()).toBe(true);
    });

    it("não deve aprovar se não estiver aguardando aprovação", () => {
      const ordem = OrdemServico.criar({});

      expect(() => ordem.aprovarOrcamento()).toThrow(BusinessRuleException);
    });
  });

  describe("execução", () => {
    function criarOrdemEmExecucao(): OrdemServico {
      const ordem = OrdemServico.criar({});

      ordem.definirCliente("cliente-1");
      ordem.definirVeiculo("veiculo-1");
      ordem.atualizarValorTotal(100);

      return ordem;
    }

    it("não deve iniciar execução automaticamente ao aprovar (transição inválida)", () => {
      const ordem = criarOrdemEmExecucao();

      expect(() => ordem.aprovarOrcamento()).toThrow();
    });

    it("não deve finalizar execução se não iniciada", () => {
      const ordem = OrdemServico.criar({});

      expect(() =>
        ordem.atualizarStatusManualmente(StatusOrdemServico.FINALIZADA),
      ).toThrow();
    });
  });

  describe("atualizarValorTotal", () => {
    it("deve permitir valor zero", () => {
      const ordem = OrdemServico.criar({});

      ordem.atualizarValorTotal(0);

      expect(ordem.valorTotal.equals(Preco.zero())).toBe(true);
    });

    it("deve transicionar para aguardando aprovação ao definir valor > 0", () => {
      const ordem = OrdemServico.criar({});

      ordem.definirCliente("cliente-1");
      ordem.definirVeiculo("veiculo-1");

      ordem.atualizarValorTotal(200);

      expect(ordem.status.isAguardandoAprovacao()).toBe(true);
    });
  });

  describe("métodos auxiliares", () => {
    it("deve identificar cliente e veículo", () => {
      const ordem = OrdemServico.criar({
        clienteId,
        veiculoId,
      });

      expect(ordem.temCliente()).toBe(true);
      expect(ordem.temVeiculo()).toBe(true);
      expect(ordem.temClienteEVeiculo()).toBe(true);
    });

    it("deve comparar igualdade por id", () => {
      const ordem1 = OrdemServico.criar({});
      const ordem2 = OrdemServico.reconstituir(ordem1.toSnapshot());

      expect(ordem1.equals(ordem2)).toBe(true);
    });

    it("deve retornar snapshot completo", () => {
      const ordem = OrdemServico.criar({});

      const snapshot = ordem.toSnapshot();

      expect(snapshot.id).toBeDefined();
      expect(snapshot.status).toBeDefined();
      expect(snapshot.valorTotal).toBeDefined();
      expect(snapshot.periodoExecucao).toBeDefined();
      expect(snapshot.createdAt).toBeInstanceOf(Date);
      expect(snapshot.updatedAt).toBeInstanceOf(Date);
    });
  });
});
