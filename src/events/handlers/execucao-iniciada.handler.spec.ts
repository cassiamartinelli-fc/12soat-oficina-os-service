import { Test, TestingModule } from "@nestjs/testing";
import { ExecucaoIniciadaHandler } from "./execucao-iniciada.handler";
import { EventBusService } from "../event-bus.service";
import { Logger } from "@nestjs/common";

describe("ExecucaoIniciadaHandler", () => {
  let handler: ExecucaoIniciadaHandler;
  let eventBus: { registerHandler: jest.Mock };

  beforeEach(async () => {
    eventBus = {
      registerHandler: jest.fn(),
    };

    jest.spyOn(Logger.prototype, "log").mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecucaoIniciadaHandler,
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    handler = module.get(ExecucaoIniciadaHandler);
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
      "EXECUCAO_INICIADA",
      expect.any(Function),
    );
  });

  it("should log when handling event", async () => {
    await handler.handle({
      payload: { osId: "123", dataInicio: "2026-01-01" },
    } as any);

    expect(Logger.prototype.log).toHaveBeenCalledWith(
      "ExecucaoIniciada recebido para OS 123 em 2026-01-01",
    );
  });
});
