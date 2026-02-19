import { Test, TestingModule } from "@nestjs/testing";
import { OrcamentoAprovadoHandler } from "./orcamento-aprovado.handler";
import { EventBusService } from "../event-bus.service";
import { AtualizarStatusOrdemServicoUseCase } from "../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { StatusOrdemServico } from "../../domain/value-objects/status-ordem-servico.vo";

describe("OrcamentoAprovadoHandler", () => {
  let handler: OrcamentoAprovadoHandler;
  let eventBus: jest.Mocked<EventBusService>;
  let atualizarStatus: jest.Mocked<AtualizarStatusOrdemServicoUseCase>;

  beforeEach(async () => {
    eventBus = {
      registerHandler: jest.fn(),
    } as any;

    atualizarStatus = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrcamentoAprovadoHandler,
        { provide: EventBusService, useValue: eventBus },
        {
          provide: AtualizarStatusOrdemServicoUseCase,
          useValue: atualizarStatus,
        },
      ],
    }).compile();

    handler = module.get<OrcamentoAprovadoHandler>(OrcamentoAprovadoHandler);
  });

  describe("onModuleInit", () => {
    it("should register handler for ORCAMENTO_APROVADO event", () => {
      handler.onModuleInit();

      expect(eventBus.registerHandler).toHaveBeenCalledTimes(1);
      expect(eventBus.registerHandler).toHaveBeenCalledWith(
        "ORCAMENTO_APROVADO",
        expect.any(Function),
      );
    });
  });

  describe("handle", () => {
    it("should update status to PAGAMENTO_APROVADO", async () => {
      const event = {
        payload: {
          osId: "123",
        },
      };

      await handler.handle(event as any);

      expect(atualizarStatus.execute).toHaveBeenCalledTimes(1);
      expect(atualizarStatus.execute).toHaveBeenCalledWith({
        ordemServicoId: "123",
        novoStatus: StatusOrdemServico.PAGAMENTO_APROVADO,
      });
    });

    it("should not throw if use case fails", async () => {
      atualizarStatus.execute.mockRejectedValueOnce(new Error("fail"));

      const event = {
        payload: {
          osId: "123",
        },
      };

      await expect(handler.handle(event as any)).resolves.not.toThrow();
      expect(atualizarStatus.execute).toHaveBeenCalled();
    });
  });
});
