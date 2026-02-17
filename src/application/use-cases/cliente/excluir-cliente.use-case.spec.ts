import { ExcluirClienteUseCase } from "./excluir-cliente.use-case";
import { IClienteRepository } from "../../../domain/repositories/cliente.repository.interface";
import { Cliente } from "../../../domain/entities/cliente.entity";
import { ClienteId } from "../../../shared/types/entity-id";
import { EntityNotFoundException } from "../../../shared/exceptions/domain.exception";

describe("ExcluirClienteUseCase", () => {
  let useCase: ExcluirClienteUseCase;
  let clienteRepository: jest.Mocked<IClienteRepository>;

  const clienteMock = {
    id: ClienteId.criar("1"),
  } as unknown as Cliente;

  beforeEach(() => {
    clienteRepository = {
      buscarPorId: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<IClienteRepository>;

    useCase = new ExcluirClienteUseCase(clienteRepository);

    jest.clearAllMocks();
  });

  it("deve excluir cliente quando existir", async () => {
    clienteRepository.buscarPorId.mockResolvedValue(clienteMock);
    clienteRepository.excluir.mockResolvedValue(undefined);

    await useCase.execute("1");

    expect(clienteRepository.buscarPorId).toHaveBeenCalled();

    const clienteIdEsperado = ClienteId.criar("1");
    expect(clienteRepository.excluir).toHaveBeenCalledWith(clienteIdEsperado);
  });

  it("deve lançar EntityNotFoundException quando cliente não existir", async () => {
    clienteRepository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute("1")).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );

    expect(clienteRepository.excluir).not.toHaveBeenCalled();
  });
});
