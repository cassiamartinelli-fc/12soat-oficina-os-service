import { ExcluirPecaUseCase } from "./excluir-peca.use-case";
import { IPecaRepository } from "../../../domain/repositories/peca.repository.interface";
import { Peca } from "../../../domain/entities/peca.entity";
import { PecaId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("ExcluirPecaUseCase", () => {
  let useCase: ExcluirPecaUseCase;
  let pecaRepository: jest.Mocked<IPecaRepository>;

  const pecaMock = {
    id: PecaId.criar("1"),
  } as unknown as Peca;

  beforeEach(() => {
    pecaRepository = {
      buscarPorId: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<IPecaRepository>;

    useCase = new ExcluirPecaUseCase(pecaRepository);

    jest.clearAllMocks();
  });

  it("deve excluir peça quando existir", async () => {
    pecaRepository.buscarPorId.mockResolvedValue(pecaMock);
    pecaRepository.excluir.mockResolvedValue(undefined);

    await useCase.execute("1");

    const pecaIdEsperado = PecaId.criar("1");

    expect(pecaRepository.buscarPorId).toHaveBeenCalledWith(pecaIdEsperado);
    expect(pecaRepository.excluir).toHaveBeenCalledWith(pecaIdEsperado);
  });

  it("deve lançar EntityNotFoundException quando peça não existir", async () => {
    pecaRepository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute("1")).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );

    expect(pecaRepository.excluir).not.toHaveBeenCalled();
  });
});
