import { BuscarServicoUseCase } from "./buscar-servico.use-case";
import { IServicoRepository } from "../../../domain/repositories/servico.repository.interface";
import { Servico } from "../../../domain/entities/servico.entity";
import { ServicoId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("BuscarServicoUseCase", () => {
  let useCase: BuscarServicoUseCase;
  let servicoRepository: jest.Mocked<IServicoRepository>;

  const servicoMock = {
    id: ServicoId.criar("1"),
  } as unknown as Servico;

  beforeEach(() => {
    servicoRepository = {
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
    } as unknown as jest.Mocked<IServicoRepository>;

    useCase = new BuscarServicoUseCase(servicoRepository);

    jest.clearAllMocks();
  });

  describe("buscarPorId", () => {
    it("deve retornar serviço quando existir", async () => {
      servicoRepository.buscarPorId.mockResolvedValue(servicoMock);

      const result = await useCase.buscarPorId("1");

      expect(servicoRepository.buscarPorId).toHaveBeenCalledWith(
        ServicoId.criar("1"),
      );
      expect(result).toBe(servicoMock);
    });

    it("deve lançar EntityNotFoundException quando serviço não existir", async () => {
      servicoRepository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.buscarPorId("1")).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe("buscarTodos", () => {
    it("deve retornar lista de serviços", async () => {
      const listaMock = [servicoMock];
      servicoRepository.buscarTodos.mockResolvedValue(listaMock);

      const result = await useCase.buscarTodos();

      expect(servicoRepository.buscarTodos).toHaveBeenCalled();
      expect(result).toEqual(listaMock);
    });
  });
});
