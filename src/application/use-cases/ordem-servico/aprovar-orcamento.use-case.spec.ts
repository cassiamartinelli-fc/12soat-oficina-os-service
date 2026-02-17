import { AprovarOrcamentoUseCase } from "./aprovar-orcamento.use-case";
import {
  EntityNotFoundException,
  BusinessRuleException,
} from "../../../shared/exceptions/domain.exception";
import { OrdemServicoId } from "../../../shared/types/entity-id";
import type { IOrdemServicoRepository } from "../../../domain/repositories/ordem-servico.repository.interface";
import { OrdemServico } from "../../../domain/entities/ordem-servico.entity";

describe("AprovarOrcamentoUseCase", () => {
  let useCase: AprovarOrcamentoUseCase;
  let repository: jest.Mocked<IOrdemServicoRepository>;

  const ordemServicoId = "os-id-123";

  const criarOrdemMock = (aguardandoAprovacao: boolean) =>
    ({
      id: OrdemServicoId.criar(ordemServicoId),
      status: {
        isAguardandoAprovacao: jest.fn().mockReturnValue(aguardandoAprovacao),
      },
      aprovarOrcamento: jest.fn(),
      rejeitarOrcamento: jest.fn(),
    }) as unknown as OrdemServico;

  beforeEach(() => {
    repository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn(),
    } as unknown as jest.Mocked<IOrdemServicoRepository>;

    useCase = new AprovarOrcamentoUseCase(repository);
  });

  it("deve aprovar orçamento quando aprovado = true e status AGUARDANDO_APROVACAO", async () => {
    const ordemMock = criarOrdemMock(true);
    repository.buscarPorId.mockResolvedValue(ordemMock);

    const result = await useCase.execute({
      ordemServicoId,
      aprovado: true,
    });

    const argumentoChamado = repository.buscarPorId.mock.calls[0][0];

    expect(argumentoChamado.equals(OrdemServicoId.criar(ordemServicoId))).toBe(
      true,
    );
    expect(ordemMock.aprovarOrcamento).toHaveBeenCalledTimes(1);
    expect(ordemMock.rejeitarOrcamento).not.toHaveBeenCalled();
    expect(repository.salvar).toHaveBeenCalledWith(ordemMock);
    expect(result).toBe(ordemMock);
  });

  it("deve rejeitar orçamento quando aprovado = false e status AGUARDANDO_APROVACAO", async () => {
    const ordemMock = criarOrdemMock(true);
    repository.buscarPorId.mockResolvedValue(ordemMock);

    const result = await useCase.execute({
      ordemServicoId,
      aprovado: false,
    });

    expect(ordemMock.rejeitarOrcamento).toHaveBeenCalledTimes(1);
    expect(ordemMock.aprovarOrcamento).not.toHaveBeenCalled();
    expect(repository.salvar).toHaveBeenCalledWith(ordemMock);
    expect(result).toBe(ordemMock);
  });

  it("deve lançar EntityNotFoundException quando ordem não existir", async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        ordemServicoId,
        aprovado: true,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundException);

    expect(repository.salvar).not.toHaveBeenCalled();
  });

  it("deve lançar BusinessRuleException quando status não for AGUARDANDO_APROVACAO", async () => {
    const ordemMock = criarOrdemMock(false);
    repository.buscarPorId.mockResolvedValue(ordemMock);

    await expect(
      useCase.execute({
        ordemServicoId,
        aprovado: true,
      }),
    ).rejects.toBeInstanceOf(BusinessRuleException);

    expect(ordemMock.aprovarOrcamento).not.toHaveBeenCalled();
    expect(ordemMock.rejeitarOrcamento).not.toHaveBeenCalled();
    expect(repository.salvar).not.toHaveBeenCalled();
  });
});
