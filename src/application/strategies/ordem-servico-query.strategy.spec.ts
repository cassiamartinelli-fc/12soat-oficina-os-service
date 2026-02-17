import {
  BuscarTodasOrdensStrategy,
  BuscarPorClienteStrategy,
  BuscarPorVeiculoStrategy,
  BuscarPorStatusStrategy,
} from "./ordem-servico-query.strategy";
import { BuscarOrdemServicoUseCase } from "../use-cases/ordem-servico";
import { OrdemServico } from "../../domain/entities";
import { StatusOrdemServico } from "../../domain/value-objects";

describe("OrdemServicoQueryStrategy", () => {
  let useCase: jest.Mocked<BuscarOrdemServicoUseCase>;
  const ordensMock = [{} as OrdemServico];

  beforeEach(() => {
    useCase = {
      buscarTodos: jest.fn(),
      buscarPorCliente: jest.fn(),
      buscarPorVeiculo: jest.fn(),
      buscarPorStatus: jest.fn(),
    } as unknown as jest.Mocked<BuscarOrdemServicoUseCase>;

    jest.clearAllMocks();
  });

  describe("BuscarTodasOrdensStrategy", () => {
    it("deve chamar buscarTodos do use case", async () => {
      useCase.buscarTodos.mockResolvedValue(ordensMock);

      const strategy = new BuscarTodasOrdensStrategy(useCase);
      const result = await strategy.execute();

      expect(useCase.buscarTodos).toHaveBeenCalled();
      expect(result).toBe(ordensMock);
    });
  });

  describe("BuscarPorClienteStrategy", () => {
    it("deve chamar buscarPorCliente com clienteId", async () => {
      useCase.buscarPorCliente.mockResolvedValue(ordensMock);

      const strategy = new BuscarPorClienteStrategy(useCase, "1");
      const result = await strategy.execute();

      expect(useCase.buscarPorCliente).toHaveBeenCalledWith("1");
      expect(result).toBe(ordensMock);
    });
  });

  describe("BuscarPorVeiculoStrategy", () => {
    it("deve chamar buscarPorVeiculo com veiculoId", async () => {
      useCase.buscarPorVeiculo.mockResolvedValue(ordensMock);

      const strategy = new BuscarPorVeiculoStrategy(useCase, "2");
      const result = await strategy.execute();

      expect(useCase.buscarPorVeiculo).toHaveBeenCalledWith("2");
      expect(result).toBe(ordensMock);
    });
  });

  describe("BuscarPorStatusStrategy", () => {
    it("deve chamar buscarPorStatus com status", async () => {
      const statusMock = {} as StatusOrdemServico;
      useCase.buscarPorStatus.mockResolvedValue(ordensMock);

      const strategy = new BuscarPorStatusStrategy(useCase, statusMock);
      const result = await strategy.execute();

      expect(useCase.buscarPorStatus).toHaveBeenCalledWith(statusMock);
      expect(result).toBe(ordensMock);
    });
  });
});
