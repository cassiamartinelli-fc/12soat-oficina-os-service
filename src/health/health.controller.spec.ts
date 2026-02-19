import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return health status with default environment", () => {
    delete process.env.NODE_ENV;

    const result = controller.check();

    expect(result.status).toBe("ok");
    expect(result.environment).toBe("development");
    expect(new Date(result.timestamp).toString()).not.toBe("Invalid Date");
  });

  it("should return health status with NODE_ENV", () => {
    process.env.NODE_ENV = "production";

    const result = controller.check();

    expect(result.status).toBe("ok");
    expect(result.environment).toBe("production");
    expect(new Date(result.timestamp).toString()).not.toBe("Invalid Date");
  });
});
