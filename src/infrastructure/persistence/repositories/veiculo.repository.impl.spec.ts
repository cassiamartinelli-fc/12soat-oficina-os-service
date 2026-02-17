import { Repository } from "typeorm";
import { VeiculoRepositoryImpl } from "./veiculo.repository.impl";
import { Veiculo } from "../../../domain/entities/veiculo.entity";
import { VeiculoId, ClienteId } from "../../../shared/types/entity-id";
import { Placa } from "../../../domain/value-objects/placa.vo";
import { Veiculo as VeiculoOrmEntity } from "../entities/veiculo.entity";
import { VeiculoMapper } from "../mappers/veiculo.mapper";

describe("VeiculoRepositoryImpl", () => {
  let repository: VeiculoRepositoryImpl;
  let ormRepository: jest.Mocked<Repository<VeiculoOrmEntity>>;
  let mapper: jest.Mocked<VeiculoMapper>;

  const domainVeiculo = {} as Veiculo;
  const ormVeiculo = {
    id: "1",
    placa: "ABC1234",
    clienteId: "c1",
  } as VeiculoOrmEntity;

  beforeEach(() => {
    ormRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<VeiculoOrmEntity>>;

    mapper = {
      toOrm: jest.fn(),
      toDomain: jest.fn(),
      toDomainArray: jest.fn(),
    } as unknown as jest.Mocked<VeiculoMapper>;

    repository = new VeiculoRepositoryImpl(ormRepository, mapper);

    jest.clearAllMocks();
  });

  it("deve salvar veículo", async () => {
    mapper.toOrm.mockReturnValue(ormVeiculo);
    ormRepository.save.mockResolvedValue(ormVeiculo);

    await repository.salvar(domainVeiculo);

    expect(mapper.toOrm).toHaveBeenCalledWith(domainVeiculo);
    expect(ormRepository.save).toHaveBeenCalledWith(ormVeiculo);
  });

  it("deve buscar por id quando existir", async () => {
    ormRepository.findOne.mockResolvedValue(ormVeiculo);
    mapper.toDomain.mockReturnValue(domainVeiculo);

    const result = await repository.buscarPorId(VeiculoId.criar("1"));

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(mapper.toDomain).toHaveBeenCalledWith(ormVeiculo);
    expect(result).toBe(domainVeiculo);
  });

  it("deve retornar null ao buscar por id inexistente", async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.buscarPorId(VeiculoId.criar("1"));

    expect(result).toBeNull();
  });

  it("deve buscar por placa quando existir", async () => {
    ormRepository.findOne.mockResolvedValue(ormVeiculo);
    mapper.toDomain.mockReturnValue(domainVeiculo);

    const result = await repository.buscarPorPlaca(Placa.criar("ABC1234"));

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { placa: "ABC1234" },
    });
    expect(mapper.toDomain).toHaveBeenCalledWith(ormVeiculo);
    expect(result).toBe(domainVeiculo);
  });

  it("deve retornar null ao buscar por placa inexistente", async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.buscarPorPlaca(Placa.criar("ABC1234"));

    expect(result).toBeNull();
  });

  it("deve buscar por clienteId", async () => {
    const ormList = [ormVeiculo];
    const domainList = [domainVeiculo];

    ormRepository.find.mockResolvedValue(ormList);
    mapper.toDomainArray.mockReturnValue(domainList);

    const result = await repository.buscarPorClienteId(ClienteId.criar("c1"));

    expect(ormRepository.find).toHaveBeenCalledWith({
      where: { clienteId: "c1" },
    });
    expect(mapper.toDomainArray).toHaveBeenCalledWith(ormList);
    expect(result).toEqual(domainList);
  });

  it("deve buscar todos os veículos", async () => {
    const ormList = [ormVeiculo];
    const domainList = [domainVeiculo];

    ormRepository.find.mockResolvedValue(ormList);
    mapper.toDomainArray.mockReturnValue(domainList);

    const result = await repository.buscarTodos();

    expect(ormRepository.find).toHaveBeenCalled();
    expect(mapper.toDomainArray).toHaveBeenCalledWith(ormList);
    expect(result).toEqual(domainList);
  });

  it("deve excluir veículo", async () => {
    ormRepository.delete.mockResolvedValue({} as any);

    await repository.excluir(VeiculoId.criar("1"));

    expect(ormRepository.delete).toHaveBeenCalledWith({ id: "1" });
  });
});
