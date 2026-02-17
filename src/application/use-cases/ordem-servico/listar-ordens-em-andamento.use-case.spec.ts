import { ListarOrdensEmAndamentoUseCase } from "./listar-ordens-em-andamento.use-case";
import type { IOrdemServicoRepository } from "../../../domain/repositories/ordem-servico.repository.interface";
import { OrdemServico } from "../../../domain/entities/ordem-servico.entity";

describe("ListarOrdensEmAndamentoUseCase", () => {
  let useCase: ListarOrdensEmAndamentoUseCase;
  let repository: jest.Mocked<IOrdemServicoRepository>;

  beforeEach(() => {
    repository = {
      buscarOrdensEmAndamento: jest.fn(),
    } as unknown as jest.Mocked<IOrdemServicoRepository>;

    useCase = new ListarOrdensEmAndamentoUseCase(repository);
  });

  const criarOrdemMock = (prioridade: number, createdAt: Date): OrdemServico =>
    ({
      status: {
        getPrioridade: jest.fn().mockReturnValue(prioridade),
      },
      createdAt,
    }) as unknown as OrdemServico;

  it("deve retornar lista vazia quando não houver ordens", async () => {
    repository.buscarOrdensEmAndamento.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(repository.buscarOrdensEmAndamento).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it("deve ordenar por prioridade crescente", async () => {
    const ordem1 = criarOrdemMock(2, new Date("2024-01-01"));
    const ordem2 = criarOrdemMock(1, new Date("2024-01-01"));

    repository.buscarOrdensEmAndamento.mockResolvedValue([ordem1, ordem2]);

    const result = await useCase.execute();

    expect(result[0]).toBe(ordem2);
    expect(result[1]).toBe(ordem1);
  });

  it("deve ordenar por data de criação quando prioridade for igual", async () => {
    const ordemMaisRecente = criarOrdemMock(1, new Date("2024-02-01"));
    const ordemMaisAntiga = criarOrdemMock(1, new Date("2024-01-01"));

    repository.buscarOrdensEmAndamento.mockResolvedValue([
      ordemMaisRecente,
      ordemMaisAntiga,
    ]);

    const result = await useCase.execute();

    expect(result[0]).toBe(ordemMaisAntiga);
    expect(result[1]).toBe(ordemMaisRecente);
  });
});
