import { Repository, DeleteResult } from "typeorm";
import { ClienteRepositoryImpl } from "./cliente.repository.impl";

import { Cliente } from "../../../domain/entities/cliente.entity";
import { ClienteId } from "../../../shared/types/entity-id";
import { CpfCnpj } from "../../../domain/value-objects/cpf-cnpj.vo";

import { Cliente as ClienteOrm } from "../entities/cliente.entity";
import { ClienteMapper } from "../mappers/cliente.mapper";

describe("ClienteRepositoryImpl", () => {
  let repository: ClienteRepositoryImpl;
  let ormRepository: jest.Mocked<Repository<ClienteOrm>>;
  let mapper: jest.Mocked<ClienteMapper>;

  const domainCliente = {} as Cliente;
  const ormCliente = {} as ClienteOrm;

  beforeEach(() => {
    ormRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<ClienteOrm>>;

    mapper = {
      toOrm: jest.fn(),
      toDomain: jest.fn(),
      toDomainArray: jest.fn(),
    } as unknown as jest.Mocked<ClienteMapper>;

    repository = new ClienteRepositoryImpl(ormRepository, mapper);

    jest.clearAllMocks();
  });

  it("deve salvar cliente", async () => {
    mapper.toOrm.mockReturnValue(ormCliente);
    ormRepository.save.mockResolvedValue(ormCliente);

    await repository.salvar(domainCliente);

    expect(mapper.toOrm).toHaveBeenCalledWith(domainCliente);
    expect(ormRepository.save).toHaveBeenCalledWith(ormCliente);
  });

  it("deve buscar por id quando existir", async () => {
    ormRepository.findOne.mockResolvedValue(ormCliente);
    mapper.toDomain.mockReturnValue(domainCliente);

    const result = await repository.buscarPorId(ClienteId.criar("1"));

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });

    expect(mapper.toDomain).toHaveBeenCalledWith(ormCliente);
    expect(result).toBe(domainCliente);
  });

  it("deve retornar null ao buscar por id inexistente", async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.buscarPorId(ClienteId.criar("1"));

    expect(result).toBeNull();
  });

  it("deve buscar por cpfCnpj quando existir", async () => {
    const cpfMock = {
      obterValor: jest.fn().mockReturnValue("12345678900"),
    } as unknown as CpfCnpj;

    ormRepository.findOne.mockResolvedValue(ormCliente);
    mapper.toDomain.mockReturnValue(domainCliente);

    const result = await repository.buscarPorCpfCnpj(cpfMock);

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { cpfCnpj: "12345678900" },
    });

    expect(mapper.toDomain).toHaveBeenCalledWith(ormCliente);
    expect(result).toBe(domainCliente);
  });

  it("deve retornar null ao buscar por cpfCnpj inexistente", async () => {
    const cpfMock = {
      obterValor: jest.fn().mockReturnValue("12345678900"),
    } as unknown as CpfCnpj;

    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.buscarPorCpfCnpj(cpfMock);

    expect(result).toBeNull();
  });

  it("deve buscar todos", async () => {
    ormRepository.find.mockResolvedValue([ormCliente]);
    mapper.toDomainArray.mockReturnValue([domainCliente]);

    const result = await repository.buscarTodos();

    expect(ormRepository.find).toHaveBeenCalled();
    expect(mapper.toDomainArray).toHaveBeenCalledWith([ormCliente]);
    expect(result).toEqual([domainCliente]);
  });

  it("deve excluir cliente", async () => {
    ormRepository.delete.mockResolvedValue({} as DeleteResult);

    await repository.excluir(ClienteId.criar("1"));

    expect(ormRepository.delete).toHaveBeenCalledWith({
      id: "1",
    });
  });
});
