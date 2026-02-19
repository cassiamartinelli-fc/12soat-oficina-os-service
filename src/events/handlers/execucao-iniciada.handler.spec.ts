import { Test, TestingModule } from "@nestjs/testing";
import { ExecucaoIniciadaHandler } from "./execucao-iniciada.handler";
import { EventBusService } from "../event-bus.service";
import { AtualizarStatusOrdemServicoUseCase } from "../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { StatusOrdemServico } from "../../domain/value-objects/status-ordem-servico.vo";

describe("ExecucaoIniciadaHandler", () => {
  let handler: ExecucaoIniciadaHandler;
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
        ExecucaoIniciadaHandler,
        { provide: EventBusService, useValue: eventBus },
        {
          provide: AtualizarStatusOrdemServicoUseCase,
          useValue: atualizarStatus,
        },
      ],
    }).compile();

    handler = module.get<ExecucaoIniciadaHandler>(ExecucaoIniciadaHandler);
  });

  describe("onModuleInit", () => {
    it("should register handler for EXECUCAO_INICIADA event", () => {
      handler.onModuleInit();

      expect(eventBus.registerHandler).toHaveBeenCalledTimes(1);
      expect(eventBus.registerHandler).toHaveBeenCalledWith(
        "EXECUCAO_INICIADA",
        expect.any(Function),
      );
    });
  });

  describe("handle", () => {
    it("should update status to EM_EXECUCAO", async () => {
      const event = {
        payload: {
          osId: "123",
          dataInicio: new Date().toISOString(),
        },
      };

      await handler.handle(event as any);

      expect(atualizarStatus.execute).toHaveBeenCalledTimes(1);
      expect(atualizarStatus.execute).toHaveBeenCalledWith({
        ordemServicoId: "123",
        novoStatus: StatusOrdemServico.EM_EXECUCAO,
      });
    });

    it("should not throw if use case fails", async () => {
      atualizarStatus.execute.mockRejectedValueOnce(new Error("fail"));

      const event = {
        payload: {
          osId: "123",
          dataInicio: new Date().toISOString(),
        },
      };

      await expect(handler.handle(event as any)).resolves.not.toThrow();
      expect(atualizarStatus.execute).toHaveBeenCalled();
    });
  });
});
