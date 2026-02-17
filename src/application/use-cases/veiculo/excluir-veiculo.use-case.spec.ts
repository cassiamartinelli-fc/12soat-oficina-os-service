import { ExcluirVeiculoUseCase } from "./excluir-veiculo.use-case";
import { IVeiculoRepository } from "../../../domain/repositories/veiculo.repository.interface";
import { Veiculo } from "../../../domain/entities/veiculo.entity";
import { VeiculoId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("ExcluirVeiculoUseCase", () => {
  let useCase: ExcluirVeiculoUseCase;
  let veiculoRepository: jest.Mocked<IVeiculoRepository>;

  const veiculoMock = {
    id: VeiculoId.criar("1"),
  } as unknown as Veiculo;

  beforeEach(() => {
    veiculoRepository = {
      buscarPorId: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<IVeiculoRepository>;

    useCase = new ExcluirVeiculoUseCase(veiculoRepository);

    jest.clearAllMocks();
  });

  it("deve excluir veículo quando existir", async () => {
    veiculoRepository.buscarPorId.mockResolvedValue(veiculoMock);
    veiculoRepository.excluir.mockResolvedValue(undefined);

    await useCase.execute("1");

    const veiculoIdEsperado = VeiculoId.criar("1");

    expect(veiculoRepository.buscarPorId).toHaveBeenCalledWith(
      veiculoIdEsperado,
    );
    expect(veiculoRepository.excluir).toHaveBeenCalledWith(veiculoIdEsperado);
  });

  it("deve lançar EntityNotFoundException quando veículo não existir", async () => {
    veiculoRepository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute("1")).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );

    expect(veiculoRepository.excluir).not.toHaveBeenCalled();
  });
});
