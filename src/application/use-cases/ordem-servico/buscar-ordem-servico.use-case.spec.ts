import { BuscarOrdemServicoUseCase } from "./buscar-ordem-servico.use-case";
import type { IOrdemServicoRepository } from "../../../domain/repositories/ordem-servico.repository.interface";
import { OrdemServico } from "../../../domain/entities/ordem-servico.entity";
import {
  OrdemServicoId,
  ClienteId,
  VeiculoId,
} from "../../../shared/types/entity-id";
import { StatusOrdemServico } from "../../../domain/value-objects/status-ordem-servico.vo";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("BuscarOrdemServicoUseCase", () => {
  let useCase: BuscarOrdemServicoUseCase;
  let repository: jest.Mocked<IOrdemServicoRepository>;

  const ordemId = "os-1";
  const clienteId = "cliente-1";
  const veiculoId = "veiculo-1";

  const ordemMock = {} as OrdemServico;
  const ordensMock = [{} as OrdemServico, {} as OrdemServico];

  beforeEach(() => {
    repository = {
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
      buscarPorCliente: jest.fn(),
      buscarPorVeiculo: jest.fn(),
      buscarPorStatus: jest.fn(),
      salvar: jest.fn(),
    } as unknown as jest.Mocked<IOrdemServicoRepository>;

    useCase = new BuscarOrdemServicoUseCase(repository);
  });

  describe("buscarPorId", () => {
    it("deve retornar ordem quando encontrada", async () => {
      repository.buscarPorId.mockResolvedValue(ordemMock);

      const result = await useCase.buscarPorId(ordemId);

      expect(repository.buscarPorId).toHaveBeenCalledTimes(1);

      const argumento = repository.buscarPorId.mock.calls[0][0];
      expect(argumento.equals(OrdemServicoId.criar(ordemId))).toBe(true);

      expect(result).toBe(ordemMock);
    });

    it("deve lançar EntityNotFoundException quando não encontrada", async () => {
      repository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.buscarPorId(ordemId)).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe("buscarTodos", () => {
    it("deve retornar todas as ordens", async () => {
      repository.buscarTodos.mockResolvedValue(ordensMock);

      const result = await useCase.buscarTodos();

      expect(repository.buscarTodos).toHaveBeenCalledTimes(1);
      expect(result).toBe(ordensMock);
    });
  });

  describe("buscarPorCliente", () => {
    it("deve buscar por cliente", async () => {
      repository.buscarPorCliente.mockResolvedValue(ordensMock);

      const result = await useCase.buscarPorCliente(clienteId);

      const argumento = repository.buscarPorCliente.mock.calls[0][0];
      expect(argumento.equals(ClienteId.criar(clienteId))).toBe(true);

      expect(result).toBe(ordensMock);
    });
  });

  describe("buscarPorVeiculo", () => {
    it("deve buscar por veículo", async () => {
      repository.buscarPorVeiculo.mockResolvedValue(ordensMock);

      const result = await useCase.buscarPorVeiculo(veiculoId);

      const argumento = repository.buscarPorVeiculo.mock.calls[0][0];
      expect(argumento.equals(VeiculoId.criar(veiculoId))).toBe(true);

      expect(result).toBe(ordensMock);
    });
  });

  describe("buscarPorStatus", () => {
    it("deve buscar por status", async () => {
      const status = {} as StatusOrdemServico;
      repository.buscarPorStatus.mockResolvedValue(ordensMock);

      const result = await useCase.buscarPorStatus(status);

      expect(repository.buscarPorStatus).toHaveBeenCalledWith(status);
      expect(result).toBe(ordensMock);
    });
  });
});
