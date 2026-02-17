import { ExcluirOrdemServicoUseCase } from "./excluir-ordem-servico.use-case";
import type { IOrdemServicoRepository } from "../../../domain/repositories/ordem-servico.repository.interface";
import { OrdemServicoId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("ExcluirOrdemServicoUseCase", () => {
  let useCase: ExcluirOrdemServicoUseCase;
  let repository: jest.Mocked<IOrdemServicoRepository>;

  const ordemId = "os-123";

  beforeEach(() => {
    repository = {
      buscarPorId: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<IOrdemServicoRepository>;

    useCase = new ExcluirOrdemServicoUseCase(repository);
  });

  it("deve excluir ordem quando existir", async () => {
    repository.buscarPorId.mockResolvedValue({} as any);

    await useCase.execute(ordemId);

    expect(repository.buscarPorId).toHaveBeenCalledTimes(1);

    const argumento = repository.buscarPorId.mock.calls[0][0];
    expect(argumento.equals(OrdemServicoId.criar(ordemId))).toBe(true);

    expect(repository.excluir).toHaveBeenCalledTimes(1);

    const argumentoExcluir = repository.excluir.mock.calls[0][0];
    expect(argumentoExcluir.equals(OrdemServicoId.criar(ordemId))).toBe(true);
  });

  it("deve lançar EntityNotFoundException quando ordem não existir", async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute(ordemId)).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );

    expect(repository.excluir).not.toHaveBeenCalled();
  });
});
