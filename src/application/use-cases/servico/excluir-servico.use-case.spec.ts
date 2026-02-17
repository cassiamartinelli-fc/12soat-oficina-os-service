import { ExcluirServicoUseCase } from "./excluir-servico.use-case";
import { IServicoRepository } from "../../../domain/repositories/servico.repository.interface";
import { Servico } from "../../../domain/entities/servico.entity";
import { ServicoId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("ExcluirServicoUseCase", () => {
  let useCase: ExcluirServicoUseCase;
  let servicoRepository: jest.Mocked<IServicoRepository>;

  const servicoMock = {
    id: ServicoId.criar("1"),
  } as unknown as Servico;

  beforeEach(() => {
    servicoRepository = {
      buscarPorId: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<IServicoRepository>;

    useCase = new ExcluirServicoUseCase(servicoRepository);

    jest.clearAllMocks();
  });

  it("deve excluir serviço quando existir", async () => {
    servicoRepository.buscarPorId.mockResolvedValue(servicoMock);
    servicoRepository.excluir.mockResolvedValue(undefined);

    await useCase.execute("1");

    const servicoIdEsperado = ServicoId.criar("1");

    expect(servicoRepository.buscarPorId).toHaveBeenCalledWith(
      servicoIdEsperado,
    );
    expect(servicoRepository.excluir).toHaveBeenCalledWith(servicoIdEsperado);
  });

  it("deve lançar EntityNotFoundException quando serviço não existir", async () => {
    servicoRepository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute("1")).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );

    expect(servicoRepository.excluir).not.toHaveBeenCalled();
  });
});
