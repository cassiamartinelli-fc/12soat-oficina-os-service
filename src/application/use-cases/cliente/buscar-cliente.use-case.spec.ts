import { BuscarClienteUseCase } from "./buscar-cliente.use-case";
import { IClienteRepository } from "../../../domain/repositories/cliente.repository.interface";
import { Cliente } from "../../../domain/entities/cliente.entity";
import { ClienteId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("BuscarClienteUseCase", () => {
  let useCase: BuscarClienteUseCase;
  let clienteRepository: jest.Mocked<IClienteRepository>;

  const CPF_VALIDO = "52998224725";

  const clienteMock = {
    id: ClienteId.criar("1"),
  } as unknown as Cliente;

  beforeEach(() => {
    clienteRepository = {
      buscarPorId: jest.fn(),
      buscarPorCpfCnpj: jest.fn(),
      buscarTodos: jest.fn(),
    } as unknown as jest.Mocked<IClienteRepository>;

    useCase = new BuscarClienteUseCase(clienteRepository);

    jest.clearAllMocks();
  });

  describe("buscarPorId", () => {
    it("deve retornar cliente quando encontrado", async () => {
      clienteRepository.buscarPorId.mockResolvedValue(clienteMock);

      const result = await useCase.buscarPorId("1");

      expect(clienteRepository.buscarPorId).toHaveBeenCalled();
      expect(result).toBe(clienteMock);
    });

    it("deve lançar EntityNotFoundException quando não encontrado", async () => {
      clienteRepository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.buscarPorId("1")).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe("buscarPorCpfCnpj", () => {
    it("deve retornar cliente quando encontrado", async () => {
      clienteRepository.buscarPorCpfCnpj.mockResolvedValue(clienteMock);

      const result = await useCase.buscarPorCpfCnpj(CPF_VALIDO);

      expect(clienteRepository.buscarPorCpfCnpj).toHaveBeenCalled();
      expect(result).toBe(clienteMock);
    });

    it("deve lançar EntityNotFoundException quando não encontrado", async () => {
      clienteRepository.buscarPorCpfCnpj.mockResolvedValue(null);

      await expect(useCase.buscarPorCpfCnpj(CPF_VALIDO)).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe("buscarTodos", () => {
    it("deve retornar lista de clientes", async () => {
      const clientes = [clienteMock];
      clienteRepository.buscarTodos.mockResolvedValue(clientes);

      const result = await useCase.buscarTodos();

      expect(clienteRepository.buscarTodos).toHaveBeenCalled();
      expect(result).toEqual(clientes);
    });
  });
});
