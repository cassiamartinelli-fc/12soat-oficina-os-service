import { Test, TestingModule } from "@nestjs/testing";
import { EventBusService } from "./event-bus.service";
import { SQSClient } from "@aws-sdk/client-sqs";
import { Logger } from "@nestjs/common";

jest.mock("@aws-sdk/client-sqs", () => {
  const original = jest.requireActual("@aws-sdk/client-sqs");
  return {
    ...original,
    SQSClient: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
  };
});

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "uuid-mock"),
}));

describe("EventBusService", () => {
  let service: EventBusService;
  let module: TestingModule;
  let clientSendMock: jest.Mock;

  beforeEach(async () => {
    process.env.SQS_OS_QUEUE_URL = "http://localhost/queue";
    process.env.AWS_REGION = "us-east-1";

    module = await Test.createTestingModule({
      providers: [EventBusService],
    }).compile();

    service = module.get(EventBusService);
    clientSendMock = (service as any).client.send as jest.Mock;
    jest.spyOn(Logger.prototype, "log").mockImplementation();
    jest.spyOn(Logger.prototype, "warn").mockImplementation();
    jest.spyOn(Logger.prototype, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should register handler", () => {
    const handler = jest.fn();
    service.registerHandler("TEST_EVENT", handler);
    expect((service as any).handlers.get("TEST_EVENT")).toBe(handler);
  });

  it("should publish event", async () => {
    clientSendMock.mockResolvedValue({});
    await service.publish("TEST_EVENT", "123", { foo: "bar" });

    expect(clientSendMock).toHaveBeenCalled();
  });

  it("should not publish if queueUrl is empty", async () => {
    process.env.SQS_OS_QUEUE_URL = "";
    const newService = new EventBusService();
    const spy = jest.spyOn((newService as any).client, "send");

    await newService.publish("TEST_EVENT", "123", {});

    expect(spy).not.toHaveBeenCalled();
  });

  it("should process message and call handler", async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    service.registerHandler("TEST_EVENT", handler);

    clientSendMock.mockResolvedValue({});
    await (service as any).processMessage({
      Body: JSON.stringify({
        eventType: "TEST_EVENT",
        aggregateId: "123",
      }),
      ReceiptHandle: "abc",
    });

    expect(handler).toHaveBeenCalled();
    expect(clientSendMock).toHaveBeenCalled();
  });

  it("should handle error in publish", async () => {
    clientSendMock.mockRejectedValue(new Error("fail"));
    await service.publish("TEST_EVENT", "123", {});
    expect(Logger.prototype.error).toHaveBeenCalled();
  });

  it("should handle error in processMessage", async () => {
    clientSendMock.mockRejectedValue(new Error("fail"));
    await (service as any).processMessage({
      Body: "invalid-json",
      ReceiptHandle: "abc",
    });
    expect(Logger.prototype.error).toHaveBeenCalled();
  });
});
