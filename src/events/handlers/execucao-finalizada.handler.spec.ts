import { Test, TestingModule } from "@nestjs/testing";
import { ExecucaoFinalizadaHandler } from "./execucao-finalizada.handler";
import { EventBusService } from "../event-bus.service";
import { AtualizarStatusOrdemServicoUseCase } from "../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { StatusOrdemServico } from "../../domain/value-objects/status-ordem-servico.vo";
import { Logger } from "@nestjs/common";

describe("ExecucaoFinalizadaHandler", () => {
  let handler: ExecucaoFinalizadaHandler;
  let eventBus: { registerHandler: jest.Mock };
  let atualizarStatus: { execute: jest.Mock };

  beforeEach(async () => {
    eventBus = {
      registerHandler: jest.fn(),
    };

    atualizarStatus = {
      execute: jest.fn(),
    };

    jest.spyOn(Logger.prototype, "log").mockImplementation();
    jest.spyOn(Logger.prototype, "error").mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecucaoFinalizadaHandler,
        { provide: EventBusService, useValue: eventBus },
        {
          provide: AtualizarStatusOrdemServicoUseCase,
          useValue: atualizarStatus,
        },
      ],
    }).compile();

    handler = module.get(ExecucaoFinalizadaHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  it("should register handler on module init", () => {
    handler.onModuleInit();
    expect(eventBus.registerHandler).toHaveBeenCalledWith(
      "EXECUCAO_FINALIZADA",
      expect.any(Function),
    );
  });

  it("should handle event and update status to FINALIZADA", async () => {
    atualizarStatus.execute.mockResolvedValue(undefined);

    await handler.handle({
      payload: { osId: "123" },
    } as any);

    expect(atualizarStatus.execute).toHaveBeenCalledWith({
      ordemServicoId: "123",
      novoStatus: StatusOrdemServico.FINALIZADA,
    });
    expect(Logger.prototype.log).toHaveBeenCalled();
  });

  it("should log error if update fails", async () => {
    atualizarStatus.execute.mockRejectedValue(new Error("fail"));

    await handler.handle({
      payload: { osId: "123" },
    } as any);

    expect(Logger.prototype.error).toHaveBeenCalled();
  });
});
