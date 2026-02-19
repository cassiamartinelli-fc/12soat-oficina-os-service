import { Test, TestingModule } from "@nestjs/testing";
import { OrcamentoCanceladoHandler } from "./orcamento-cancelado.handler";
import { EventBusService } from "../event-bus.service";
import { AtualizarStatusOrdemServicoUseCase } from "../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { StatusOrdemServico } from "../../domain/value-objects/status-ordem-servico.vo";
import { Logger } from "@nestjs/common";

describe("OrcamentoCanceladoHandler", () => {
  let handler: OrcamentoCanceladoHandler;
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
        OrcamentoCanceladoHandler,
        { provide: EventBusService, useValue: eventBus },
        {
          provide: AtualizarStatusOrdemServicoUseCase,
          useValue: atualizarStatus,
        },
      ],
    }).compile();

    handler = module.get(OrcamentoCanceladoHandler);
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
      "ORCAMENTO_CANCELADO",
      expect.any(Function),
    );
  });

  it("should handle event and update status to CANCELADA", async () => {
    atualizarStatus.execute.mockResolvedValue(undefined);

    await handler.handle({
      payload: { osId: "123" },
    } as any);

    expect(atualizarStatus.execute).toHaveBeenCalledWith({
      ordemServicoId: "123",
      novoStatus: StatusOrdemServico.CANCELADA,
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
