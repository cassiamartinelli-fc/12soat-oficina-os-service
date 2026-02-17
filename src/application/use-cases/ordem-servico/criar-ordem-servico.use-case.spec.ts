import { CriarOrdemServicoUseCase } from "./criar-ordem-servico.use-case";
import type { IOrdemServicoRepository } from "../../../domain/repositories/ordem-servico.repository.interface";
import type { IServicoRepository } from "../../../domain/repositories/servico.repository.interface";
import type { IPecaRepository } from "../../../domain/repositories/peca.repository.interface";
import { MetricsService } from "../../../shared/services/metrics.service";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";
import { OrdemServico } from "../../../domain/entities/ordem-servico.entity";

jest.mock("../../../domain/entities/ordem-servico.entity");
jest.mock("../../../domain/entities/item-servico.entity");
jest.mock("../../../domain/entities/item-peca.entity");

describe("CriarOrdemServicoUseCase", () => {
  let useCase: CriarOrdemServicoUseCase;
  let ordemServicoRepository: jest.Mocked<IOrdemServicoRepository>;
  let servicoRepository: jest.Mocked<IServicoRepository>;
  let pecaRepository: jest.Mocked<IPecaRepository>;
  let metricsService: jest.Mocked<MetricsService>;

  const ordemMock = {
    id: { obterValor: jest.fn().mockReturnValue("os-1") },
    atualizarValorTotal: jest.fn(),
  } as unknown as OrdemServico;

  beforeEach(() => {
    ordemServicoRepository = {
      salvar: jest.fn(),
      adicionarItemServico: jest.fn(),
      adicionarItemPeca: jest.fn(),
    } as any;

    servicoRepository = {
      buscarPorId: jest.fn(),
    } as any;

    pecaRepository = {
      buscarPorId: jest.fn(),
    } as any;

    metricsService = {
      recordOrdemServicoCriada: jest.fn(),
    } as any;
    (OrdemServico.criar as jest.Mock).mockReturnValue(ordemMock);

    useCase = new CriarOrdemServicoUseCase(
      ordemServicoRepository,
      servicoRepository,
      pecaRepository,
      metricsService,
    );
  });

  it("deve criar ordem de serviço com serviços e peças", async () => {
    servicoRepository.buscarPorId.mockResolvedValue({
      preco: { obterValor: () => 100 },
    } as any);

    pecaRepository.buscarPorId.mockResolvedValue({
      preco: { obterValor: () => 50 },
    } as any);

    const command = {
      clienteId: "cliente-1",
      veiculoId: "veiculo-1",
      servicos: [{ servicoId: "s1", quantidade: 2 }],
      pecas: [{ pecaId: "p1", quantidade: 3 }],
    };

    const result = await useCase.execute(command);

    expect(OrdemServico.criar).toHaveBeenCalled();
    expect(ordemMock.atualizarValorTotal).toHaveBeenCalledWith(
      100 * 2 + 50 * 3,
    );
    expect(ordemServicoRepository.salvar).toHaveBeenCalledWith(ordemMock);
    expect(ordemServicoRepository.adicionarItemServico).toHaveBeenCalled();
    expect(ordemServicoRepository.adicionarItemPeca).toHaveBeenCalled();
    expect(metricsService.recordOrdemServicoCriada).toHaveBeenCalled();
    expect(result).toBe(ordemMock);
  });

  it("deve lançar exceção se serviço não existir", async () => {
    servicoRepository.buscarPorId.mockResolvedValue(null);

    const command = {
      clienteId: "cliente-1",
      veiculoId: "veiculo-1",
      servicos: [{ servicoId: "s1", quantidade: 1 }],
      pecas: [],
    };

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );
  });

  it("deve lançar exceção se peça não existir", async () => {
    servicoRepository.buscarPorId.mockResolvedValue({
      preco: { obterValor: () => 100 },
    } as any);

    pecaRepository.buscarPorId.mockResolvedValue(null);

    const command = {
      clienteId: "cliente-1",
      veiculoId: "veiculo-1",
      servicos: [{ servicoId: "s1", quantidade: 1 }],
      pecas: [{ pecaId: "p1", quantidade: 1 }],
    };

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );
  });
});
