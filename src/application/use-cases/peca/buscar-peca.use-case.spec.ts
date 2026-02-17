import { BuscarPecaUseCase } from "./buscar-peca.use-case";
import { IPecaRepository } from "../../../domain/repositories/peca.repository.interface";
import { Peca } from "../../../domain/entities/peca.entity";
import { PecaId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("BuscarPecaUseCase", () => {
  let useCase: BuscarPecaUseCase;
  let pecaRepository: jest.Mocked<IPecaRepository>;

  const pecaMock = {
    id: PecaId.criar("1"),
  } as unknown as Peca;

  beforeEach(() => {
    pecaRepository = {
      buscarPorId: jest.fn(),
      buscarTodos: jest.fn(),
    } as unknown as jest.Mocked<IPecaRepository>;

    useCase = new BuscarPecaUseCase(pecaRepository);

    jest.clearAllMocks();
  });

  describe("buscarPorId", () => {
    it("deve retornar peça quando encontrada", async () => {
      pecaRepository.buscarPorId.mockResolvedValue(pecaMock);

      const result = await useCase.buscarPorId("1");

      expect(pecaRepository.buscarPorId).toHaveBeenCalled();
      expect(result).toBe(pecaMock);
    });

    it("deve lançar EntityNotFoundException quando peça não existir", async () => {
      pecaRepository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.buscarPorId("1")).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe("buscarTodos", () => {
    it("deve retornar lista de peças", async () => {
      const pecas = [pecaMock];
      pecaRepository.buscarTodos.mockResolvedValue(pecas);

      const result = await useCase.buscarTodos();

      expect(pecaRepository.buscarTodos).toHaveBeenCalled();
      expect(result).toEqual(pecas);
    });
  });
});
