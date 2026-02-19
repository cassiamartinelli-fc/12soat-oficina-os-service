import { Test, TestingModule } from "@nestjs/testing";
import { OrcamentoAprovadoHandler } from "./orcamento-aprovado.handler";
import { EventBusService } from "../event-bus.service";
import { AtualizarStatusOrdemServicoUseCase } from "../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { StatusOrdemServico } from "../../domain/value-objects/status-ordem-servico.vo";
import { Logger } from "@nestjs/common";

describe("OrcamentoAprovadoHandler", () => {
  let handler: OrcamentoAprovadoHandler;
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
        OrcamentoAprovadoHandler,
        { provide: EventBusService, useValue: eventBus },
        {
          provide: AtualizarStatusOrdemServicoUseCase,
          useValue: atualizarStatus,
        },
      ],
    }).compile();

    handler = module.get(OrcamentoAprovadoHandler);
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
      "ORCAMENTO_APROVADO",
      expect.any(Function),
    );
  });

  it("should handle event and update status to EM_EXECUCAO", async () => {
    atualizarStatus.execute.mockResolvedValue(undefined);

    await handler.handle({
      payload: { osId: "123" },
    } as any);

    expect(atualizarStatus.execute).toHaveBeenCalledWith({
      ordemServicoId: "123",
      novoStatus: StatusOrdemServico.EM_EXECUCAO,
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
