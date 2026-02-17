import { Repository } from "typeorm";
import { ServicoRepositoryImpl } from "./servico.repository.impl";
import { Servico } from "../../../domain/entities/servico.entity";
import { ServicoId } from "../../../shared/types/entity-id";
import { Servico as ServicoOrmEntity } from "../entities/servico.entity";
import { ServicoMapper } from "../mappers/servico.mapper";

describe("ServicoRepositoryImpl", () => {
  let repository: ServicoRepositoryImpl;
  let ormRepository: jest.Mocked<Repository<ServicoOrmEntity>>;
  let mapper: jest.Mocked<ServicoMapper>;

  const domainServico = {} as Servico;
  const ormServico = { id: "1" } as ServicoOrmEntity;

  beforeEach(() => {
    ormRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<ServicoOrmEntity>>;

    mapper = {
      toOrm: jest.fn(),
      toDomain: jest.fn(),
      toDomainArray: jest.fn(),
    } as unknown as jest.Mocked<ServicoMapper>;

    repository = new ServicoRepositoryImpl(ormRepository, mapper);

    jest.clearAllMocks();
  });

  it("deve salvar serviço", async () => {
    mapper.toOrm.mockReturnValue(ormServico);
    ormRepository.save.mockResolvedValue(ormServico);

    await repository.salvar(domainServico);

    expect(mapper.toOrm).toHaveBeenCalledWith(domainServico);
    expect(ormRepository.save).toHaveBeenCalledWith(ormServico);
  });

  it("deve buscar por id quando existir", async () => {
    ormRepository.findOne.mockResolvedValue(ormServico);
    mapper.toDomain.mockReturnValue(domainServico);

    const result = await repository.buscarPorId(ServicoId.criar("1"));

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(mapper.toDomain).toHaveBeenCalledWith(ormServico);
    expect(result).toBe(domainServico);
  });

  it("deve retornar null ao buscar por id inexistente", async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.buscarPorId(ServicoId.criar("1"));

    expect(result).toBeNull();
  });

  it("deve buscar todos os serviços", async () => {
    const ormList = [ormServico];
    const domainList = [domainServico];

    ormRepository.find.mockResolvedValue(ormList);
    mapper.toDomainArray.mockReturnValue(domainList);

    const result = await repository.buscarTodos();

    expect(ormRepository.find).toHaveBeenCalled();
    expect(mapper.toDomainArray).toHaveBeenCalledWith(ormList);
    expect(result).toEqual(domainList);
  });

  it("deve excluir serviço", async () => {
    ormRepository.delete.mockResolvedValue({} as any);

    await repository.excluir(ServicoId.criar("1"));

    expect(ormRepository.delete).toHaveBeenCalledWith({ id: "1" });
  });
});
