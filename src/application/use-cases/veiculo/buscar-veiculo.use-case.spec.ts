import { BuscarVeiculoUseCase } from "./buscar-veiculo.use-case";
import { IVeiculoRepository } from "../../../domain/repositories/veiculo.repository.interface";
import { Veiculo } from "../../../domain/entities/veiculo.entity";
import { VeiculoId, ClienteId } from "../../../shared/types/entity-id";
import { Placa } from "../../../domain/value-objects/placa.vo";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("BuscarVeiculoUseCase", () => {
  let useCase: BuscarVeiculoUseCase;
  let veiculoRepository: jest.Mocked<IVeiculoRepository>;

  const veiculoMock = {
    id: VeiculoId.criar("1"),
  } as unknown as Veiculo;

  beforeEach(() => {
    veiculoRepository = {
      buscarPorId: jest.fn(),
      buscarPorPlaca: jest.fn(),
      buscarPorClienteId: jest.fn(),
      buscarTodos: jest.fn(),
    } as unknown as jest.Mocked<IVeiculoRepository>;

    useCase = new BuscarVeiculoUseCase(veiculoRepository);

    jest.clearAllMocks();
  });

  describe("buscarPorId", () => {
    it("deve retornar veículo quando existir", async () => {
      veiculoRepository.buscarPorId.mockResolvedValue(veiculoMock);

      const result = await useCase.buscarPorId("1");

      expect(veiculoRepository.buscarPorId).toHaveBeenCalledWith(
        VeiculoId.criar("1"),
      );
      expect(result).toBe(veiculoMock);
    });

    it("deve lançar EntityNotFoundException quando não existir", async () => {
      veiculoRepository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.buscarPorId("1")).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe("buscarPorPlaca", () => {
    it("deve retornar veículo quando existir", async () => {
      veiculoRepository.buscarPorPlaca.mockResolvedValue(veiculoMock);

      const result = await useCase.buscarPorPlaca("ABC1234");

      expect(veiculoRepository.buscarPorPlaca).toHaveBeenCalledWith(
        Placa.criar("ABC1234"),
      );
      expect(result).toBe(veiculoMock);
    });

    it("deve lançar EntityNotFoundException quando não existir", async () => {
      veiculoRepository.buscarPorPlaca.mockResolvedValue(null);

      await expect(useCase.buscarPorPlaca("ABC1234")).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe("buscarPorClienteId", () => {
    it("deve retornar lista de veículos do cliente", async () => {
      const listaMock = [veiculoMock];
      veiculoRepository.buscarPorClienteId.mockResolvedValue(listaMock);

      const result = await useCase.buscarPorClienteId("cliente-1");

      expect(veiculoRepository.buscarPorClienteId).toHaveBeenCalledWith(
        ClienteId.criar("cliente-1"),
      );
      expect(result).toEqual(listaMock);
    });
  });

  describe("buscarTodos", () => {
    it("deve retornar todos os veículos", async () => {
      const listaMock = [veiculoMock];
      veiculoRepository.buscarTodos.mockResolvedValue(listaMock);

      const result = await useCase.buscarTodos();

      expect(veiculoRepository.buscarTodos).toHaveBeenCalled();
      expect(result).toEqual(listaMock);
    });
  });
});
