import { Test, TestingModule } from "@nestjs/testing";
import { OsCriadaPublisher } from "./os-criada.publisher";
import { EventBusService } from "../event-bus.service";

describe("OsCriadaPublisher", () => {
  let publisher: OsCriadaPublisher;
  let eventBus: { publish: jest.Mock };

  beforeEach(async () => {
    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OsCriadaPublisher,
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    publisher = module.get(OsCriadaPublisher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(publisher).toBeDefined();
  });

  it("should publish OS_CRIADA event with correct payload", async () => {
    await publisher.publish("os-1", "cliente-1", "veiculo-1", 1000);

    expect(eventBus.publish).toHaveBeenCalledWith(
      "OS_CRIADA",
      "os-1",
      {
        osId: "os-1",
        clienteId: "cliente-1",
        veiculoId: "veiculo-1",
        status: "recebida",
        valorTotal: 1000,
      },
      "os-service",
    );
  });
});
