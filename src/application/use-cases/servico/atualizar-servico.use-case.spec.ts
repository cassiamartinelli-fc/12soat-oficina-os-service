import { AtualizarServicoUseCase } from "./atualizar-servico.use-case";
import { IServicoRepository } from "../../../domain/repositories/servico.repository.interface";
import { Servico } from "../../../domain/entities/servico.entity";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("AtualizarServicoUseCase", () => {
  let useCase: AtualizarServicoUseCase;
  let servicoRepository: jest.Mocked<IServicoRepository>;
  let servicoMock: jest.Mocked<Servico>;

  beforeEach(() => {
    servicoMock = {
      atualizarNome: jest.fn(),
      atualizarPreco: jest.fn(),
    } as unknown as jest.Mocked<Servico>;

    servicoRepository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn(),
    } as unknown as jest.Mocked<IServicoRepository>;

    useCase = new AtualizarServicoUseCase(servicoRepository);

    jest.clearAllMocks();
  });

  it("deve atualizar nome do serviço", async () => {
    servicoRepository.buscarPorId.mockResolvedValue(servicoMock);
    servicoRepository.salvar.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: "1",
      nome: "Novo Nome",
    });

    expect(servicoMock.atualizarNome).toHaveBeenCalledWith("Novo Nome");
    expect(servicoMock.atualizarPreco).not.toHaveBeenCalled();
    expect(servicoRepository.salvar).toHaveBeenCalledWith(servicoMock);
    expect(result).toBe(servicoMock);
  });

  it("deve atualizar preço do serviço", async () => {
    servicoRepository.buscarPorId.mockResolvedValue(servicoMock);
    servicoRepository.salvar.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: "1",
      preco: 500,
    });

    expect(servicoMock.atualizarPreco).toHaveBeenCalledWith(500);
    expect(servicoMock.atualizarNome).not.toHaveBeenCalled();
    expect(servicoRepository.salvar).toHaveBeenCalledWith(servicoMock);
    expect(result).toBe(servicoMock);
  });

  it("deve atualizar nome e preço do serviço", async () => {
    servicoRepository.buscarPorId.mockResolvedValue(servicoMock);
    servicoRepository.salvar.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: "1",
      nome: "Revisão Completa",
      preco: 800,
    });

    expect(servicoMock.atualizarNome).toHaveBeenCalledWith("Revisão Completa");
    expect(servicoMock.atualizarPreco).toHaveBeenCalledWith(800);
    expect(servicoRepository.salvar).toHaveBeenCalledWith(servicoMock);
    expect(result).toBe(servicoMock);
  });

  it("deve lançar EntityNotFoundException se serviço não existir", async () => {
    servicoRepository.buscarPorId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        id: "1",
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundException);

    expect(servicoRepository.salvar).not.toHaveBeenCalled();
  });
});
