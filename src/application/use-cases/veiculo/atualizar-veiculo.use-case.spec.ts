import { AtualizarVeiculoUseCase } from "./atualizar-veiculo.use-case";
import { IVeiculoRepository } from "../../../domain/repositories/veiculo.repository.interface";
import { IClienteRepository } from "../../../domain/repositories/cliente.repository.interface";
import { Veiculo } from "../../../domain/entities/veiculo.entity";
import { VeiculoId, ClienteId } from "../../../shared/types/entity-id";
import { Placa } from "../../../domain/value-objects/placa.vo";
import {
  EntityNotFoundException,
  BusinessRuleException,
} from "../../../shared/exceptions/domain.exception";

describe("AtualizarVeiculoUseCase", () => {
  let useCase: AtualizarVeiculoUseCase;
  let veiculoRepository: jest.Mocked<IVeiculoRepository>;
  let clienteRepository: jest.Mocked<IClienteRepository>;
  let veiculoMock: jest.Mocked<Veiculo>;

  beforeEach(() => {
    veiculoMock = {
      placa: { obterValor: jest.fn().mockReturnValue("ABC1234") },
      clienteId: { obterValor: jest.fn().mockReturnValue("cliente-1") },
      atualizarPlaca: jest.fn(),
      atualizarMarca: jest.fn(),
      atualizarModelo: jest.fn(),
      atualizarAno: jest.fn(),
      transferirPropriedade: jest.fn(),
      equals: jest.fn(),
    } as unknown as jest.Mocked<Veiculo>;

    veiculoRepository = {
      buscarPorId: jest.fn(),
      buscarPorPlaca: jest.fn(),
      salvar: jest.fn(),
    } as unknown as jest.Mocked<IVeiculoRepository>;

    clienteRepository = {
      buscarPorId: jest.fn(),
    } as unknown as jest.Mocked<IClienteRepository>;

    useCase = new AtualizarVeiculoUseCase(veiculoRepository, clienteRepository);

    jest.clearAllMocks();
  });

  it("deve lançar EntityNotFoundException se veículo não existir", async () => {
    veiculoRepository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.execute({ id: "1" })).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );
  });

  it("deve atualizar placa se válida e não duplicada", async () => {
    veiculoRepository.buscarPorId.mockResolvedValue(veiculoMock);
    veiculoRepository.buscarPorPlaca.mockResolvedValue(null);
    veiculoRepository.salvar.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: "1",
      placa: "XYZ9999",
    });

    expect(veiculoRepository.buscarPorPlaca).toHaveBeenCalled();
    expect(veiculoMock.atualizarPlaca).toHaveBeenCalledWith("XYZ9999");
    expect(veiculoRepository.salvar).toHaveBeenCalledWith(veiculoMock);
    expect(result).toBe(veiculoMock);
  });

  it("deve lançar BusinessRuleException se placa já cadastrada", async () => {
    const outroVeiculo = { equals: jest.fn().mockReturnValue(false) } as any;

    veiculoRepository.buscarPorId.mockResolvedValue(veiculoMock);
    veiculoRepository.buscarPorPlaca.mockResolvedValue(outroVeiculo);

    await expect(
      useCase.execute({ id: "1", placa: "XYZ9999" }),
    ).rejects.toBeInstanceOf(BusinessRuleException);
  });

  it("deve transferir propriedade se cliente existir", async () => {
    veiculoRepository.buscarPorId.mockResolvedValue(veiculoMock);
    clienteRepository.buscarPorId.mockResolvedValue({} as any);
    veiculoRepository.salvar.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: "1",
      clienteId: "cliente-2",
    });

    expect(clienteRepository.buscarPorId).toHaveBeenCalledWith(
      ClienteId.criar("cliente-2"),
    );
    expect(veiculoMock.transferirPropriedade).toHaveBeenCalledWith("cliente-2");
    expect(veiculoRepository.salvar).toHaveBeenCalledWith(veiculoMock);
    expect(result).toBe(veiculoMock);
  });

  it("deve lançar EntityNotFoundException se cliente não existir", async () => {
    veiculoRepository.buscarPorId.mockResolvedValue(veiculoMock);
    clienteRepository.buscarPorId.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: "1", clienteId: "cliente-2" }),
    ).rejects.toBeInstanceOf(EntityNotFoundException);
  });

  it("deve atualizar marca, modelo e ano", async () => {
    veiculoRepository.buscarPorId.mockResolvedValue(veiculoMock);
    veiculoRepository.salvar.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: "1",
      marca: "Toyota",
      modelo: "Corolla",
      ano: 2022,
    });

    expect(veiculoMock.atualizarMarca).toHaveBeenCalledWith("Toyota");
    expect(veiculoMock.atualizarModelo).toHaveBeenCalledWith("Corolla");
    expect(veiculoMock.atualizarAno).toHaveBeenCalledWith(2022);
    expect(veiculoRepository.salvar).toHaveBeenCalledWith(veiculoMock);
    expect(result).toBe(veiculoMock);
  });
});
