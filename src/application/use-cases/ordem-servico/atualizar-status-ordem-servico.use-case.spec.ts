import { AtualizarStatusOrdemServicoUseCase } from "./atualizar-status-ordem-servico.use-case";
import type { IOrdemServicoRepository } from "../../../domain/repositories/ordem-servico.repository.interface";
import { OrdemServico } from "../../../domain/entities/ordem-servico.entity";
import { OrdemServicoId } from "../../../shared/types/entity-id";
import { StatusOrdemServico } from "../../../domain/value-objects/status-ordem-servico.vo";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";
import { MetricsService } from "../../../shared/services/metrics.service";

describe("AtualizarStatusOrdemServicoUseCase", () => {
  let useCase: AtualizarStatusOrdemServicoUseCase;
  let repository: jest.Mocked<IOrdemServicoRepository>;
  let metricsService: jest.Mocked<MetricsService>;

  const ordemServicoId = "os-123";

  const criarOrdemMock = () =>
    ({
      id: OrdemServicoId.criar(ordemServicoId),
      status: {
        obterValor: jest.fn().mockReturnValue("RECEBIDA"),
      },
      updatedAt: new Date(Date.now() - 10 * 60000), // 10 minutos atrás
      atualizarStatusManualmente: jest.fn(),
    }) as unknown as OrdemServico;

  beforeEach(() => {
    repository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn(),
    } as unknown as jest.Mocked<IOrdemServicoRepository>;

    metricsService = {
      recordTempoNoStatus: jest.fn(),
      recordMudancaStatus: jest.fn(),
    } as unknown as jest.Mocked<MetricsService>;

    useCase = new AtualizarStatusOrdemServicoUseCase(
      repository,
      metricsService,
    );
  });

  it("deve atualizar status, salvar e registrar métricas", async () => {
    const ordemMock = criarOrdemMock();
    repository.buscarPorId.mockResolvedValue(ordemMock);

    const novoStatus = {} as StatusOrdemServico;

    const result = await useCase.execute({
      ordemServicoId,
      novoStatus,
    });

    expect(repository.buscarPorId).toHaveBeenCalledTimes(1);

    expect(ordemMock.atualizarStatusManualmente).toHaveBeenCalledWith(
      novoStatus,
    );

    expect(repository.salvar).toHaveBeenCalledWith(ordemMock);

    expect(metricsService.recordTempoNoStatus).toHaveBeenCalledTimes(1);
    expect(metricsService.recordMudancaStatus).toHaveBeenCalledWith(
      "RECEBIDA",
      novoStatus,
    );

    expect(result).toBe(ordemMock);
  });

  it("deve lançar EntityNotFoundException quando ordem não existir", async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        ordemServicoId,
        novoStatus: {} as StatusOrdemServico,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundException);

    expect(repository.salvar).not.toHaveBeenCalled();
    expect(metricsService.recordTempoNoStatus).not.toHaveBeenCalled();
    expect(metricsService.recordMudancaStatus).not.toHaveBeenCalled();
  });
});
