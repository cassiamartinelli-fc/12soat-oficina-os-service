import { AtualizarPecaUseCase } from "./atualizar-peca.use-case";
import { IPecaRepository } from "../../../domain/repositories/peca.repository.interface";
import { Peca } from "../../../domain/entities/peca.entity";
import { PecaId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("AtualizarPecaUseCase", () => {
  let useCase: AtualizarPecaUseCase;
  let pecaRepository: jest.Mocked<IPecaRepository>;

  const criarPecaMock = (estoqueInicial = 10): Peca =>
    ({
      id: PecaId.criar("1"),
      atualizarNome: jest.fn(),
      atualizarCodigo: jest.fn(),
      atualizarPreco: jest.fn(),
      reporEstoque: jest.fn(),
      baixarEstoque: jest.fn(),
      estoque: {
        obterQuantidade: jest.fn().mockReturnValue(estoqueInicial),
      },
    }) as unknown as Peca;

  beforeEach(() => {
    pecaRepository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn(),
    } as unknown as jest.Mocked<IPecaRepository>;

    useCase = new AtualizarPecaUseCase(pecaRepository);

    jest.clearAllMocks();
  });

  it("deve lançar EntityNotFoundException quando peça não existir", async () => {
    pecaRepository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute({ id: "1" })).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );

    expect(pecaRepository.salvar).not.toHaveBeenCalled();
  });

  it("deve atualizar nome, código e preço quando informados", async () => {
    const peca = criarPecaMock();
    pecaRepository.buscarPorId.mockResolvedValue(peca);

    const result = await useCase.execute({
      id: "1",
      nome: "Nova Peça",
      codigo: "ABC-123",
      preco: 199.9,
    });

    expect(peca.atualizarNome).toHaveBeenCalledWith("Nova Peça");
    expect(peca.atualizarCodigo).toHaveBeenCalledWith("ABC-123");
    expect(peca.atualizarPreco).toHaveBeenCalledWith(199.9);
    expect(pecaRepository.salvar).toHaveBeenCalledWith(peca);
    expect(result).toBe(peca);
  });

  it("deve repor estoque quando quantidadeEstoque for maior que o atual", async () => {
    const peca = criarPecaMock(10);
    pecaRepository.buscarPorId.mockResolvedValue(peca);

    await useCase.execute({
      id: "1",
      quantidadeEstoque: 15,
    });

    expect(peca.reporEstoque).toHaveBeenCalledWith(5);
    expect(peca.baixarEstoque).not.toHaveBeenCalled();
  });

  it("deve baixar estoque quando quantidadeEstoque for menor que o atual", async () => {
    const peca = criarPecaMock(10);
    pecaRepository.buscarPorId.mockResolvedValue(peca);

    await useCase.execute({
      id: "1",
      quantidadeEstoque: 6,
    });

    expect(peca.baixarEstoque).toHaveBeenCalledWith(4);
    expect(peca.reporEstoque).not.toHaveBeenCalled();
  });

  it("não deve alterar estoque quando quantidadeEstoque for igual ao atual", async () => {
    const peca = criarPecaMock(10);
    pecaRepository.buscarPorId.mockResolvedValue(peca);

    await useCase.execute({
      id: "1",
      quantidadeEstoque: 10,
    });

    expect(peca.reporEstoque).not.toHaveBeenCalled();
    expect(peca.baixarEstoque).not.toHaveBeenCalled();
  });

  it("deve permitir atualizar apenas um campo sem afetar os demais", async () => {
    const peca = criarPecaMock(10);
    pecaRepository.buscarPorId.mockResolvedValue(peca);

    await useCase.execute({
      id: "1",
      nome: "Somente Nome",
    });

    expect(peca.atualizarNome).toHaveBeenCalledWith("Somente Nome");
    expect(peca.atualizarCodigo).not.toHaveBeenCalled();
    expect(peca.atualizarPreco).not.toHaveBeenCalled();
    expect(pecaRepository.salvar).toHaveBeenCalledWith(peca);
  });
});
