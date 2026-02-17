import { AtualizarClienteUseCase } from "./atualizar-cliente.use-case";
import { IClienteRepository } from "../../../domain/repositories/cliente.repository.interface";
import { Cliente } from "../../../domain/entities/cliente.entity";
import { ClienteId } from "../../../shared/types/entity-id";
import {
  EntityNotFoundException,
  BusinessRuleException,
} from "../../../shared/exceptions/domain.exception";

describe("AtualizarClienteUseCase", () => {
  let useCase: AtualizarClienteUseCase;
  let clienteRepository: jest.Mocked<IClienteRepository>;

  const CPF_VALIDO_ATUAL = "52998224725";
  const CPF_VALIDO_NOVO = "12345678909";

  const clienteMock = {
    id: ClienteId.criar("1"),
    cpfCnpj: {
      obterValor: jest.fn().mockReturnValue(CPF_VALIDO_ATUAL),
    },
    atualizarCpfCnpj: jest.fn(),
    atualizarNome: jest.fn(),
    atualizarTelefone: jest.fn(),
    equals: jest.fn(),
  } as unknown as Cliente;

  beforeEach(() => {
    clienteRepository = {
      buscarPorId: jest.fn(),
      buscarPorCpfCnpj: jest.fn(),
      salvar: jest.fn(),
    } as unknown as jest.Mocked<IClienteRepository>;

    useCase = new AtualizarClienteUseCase(clienteRepository);

    jest.clearAllMocks();
  });

  it("deve atualizar nome e telefone com sucesso", async () => {
    clienteRepository.buscarPorId.mockResolvedValue(clienteMock);

    const result = await useCase.execute({
      id: "1",
      nome: "Novo Nome",
      telefone: "999999999",
    });

    expect(clienteRepository.buscarPorId).toHaveBeenCalled();
    expect(clienteMock.atualizarNome).toHaveBeenCalledWith("Novo Nome");
    expect(clienteMock.atualizarTelefone).toHaveBeenCalledWith("999999999");
    expect(clienteRepository.salvar).toHaveBeenCalledWith(clienteMock);
    expect(result).toBe(clienteMock);
  });

  it("deve lançar EntityNotFoundException se cliente não existir", async () => {
    clienteRepository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute({ id: "1" })).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );
  });

  it("deve atualizar CPF/CNPJ se for diferente e não existir outro cliente com mesmo CPF/CNPJ", async () => {
    clienteRepository.buscarPorId.mockResolvedValue(clienteMock);
    clienteRepository.buscarPorCpfCnpj.mockResolvedValue(null);

    await useCase.execute({
      id: "1",
      cpfCnpj: CPF_VALIDO_NOVO,
    });

    expect(clienteRepository.buscarPorCpfCnpj).toHaveBeenCalled();
    expect(clienteMock.atualizarCpfCnpj).toHaveBeenCalledWith(CPF_VALIDO_NOVO);
    expect(clienteRepository.salvar).toHaveBeenCalledWith(clienteMock);
  });

  it("não deve validar CPF/CNPJ se valor for igual ao atual", async () => {
    clienteRepository.buscarPorId.mockResolvedValue(clienteMock);

    await useCase.execute({
      id: "1",
      cpfCnpj: CPF_VALIDO_ATUAL,
    });

    expect(clienteRepository.buscarPorCpfCnpj).not.toHaveBeenCalled();
    expect(clienteMock.atualizarCpfCnpj).not.toHaveBeenCalled();
  });

  it("deve lançar BusinessRuleException se CPF/CNPJ já estiver cadastrado para outro cliente", async () => {
    const outroCliente = {
      equals: jest.fn().mockReturnValue(false),
    } as unknown as Cliente;

    clienteRepository.buscarPorId.mockResolvedValue(clienteMock);
    clienteRepository.buscarPorCpfCnpj.mockResolvedValue(outroCliente);

    await expect(
      useCase.execute({
        id: "1",
        cpfCnpj: CPF_VALIDO_NOVO,
      }),
    ).rejects.toBeInstanceOf(BusinessRuleException);
  });

  it("deve permitir CPF/CNPJ já existente se for o mesmo cliente", async () => {
    const mesmoCliente = {
      equals: jest.fn().mockReturnValue(true),
    } as unknown as Cliente;

    clienteRepository.buscarPorId.mockResolvedValue(clienteMock);
    clienteRepository.buscarPorCpfCnpj.mockResolvedValue(mesmoCliente);

    await useCase.execute({
      id: "1",
      cpfCnpj: CPF_VALIDO_NOVO,
    });

    expect(clienteRepository.salvar).toHaveBeenCalledWith(clienteMock);
  });

  it("deve permitir remover telefone enviando string vazia", async () => {
    clienteRepository.buscarPorId.mockResolvedValue(clienteMock);

    await useCase.execute({
      id: "1",
      telefone: "",
    });

    expect(clienteMock.atualizarTelefone).toHaveBeenCalledWith(undefined);
  });
});
