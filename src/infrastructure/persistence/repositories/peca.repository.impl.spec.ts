import { Repository } from "typeorm";
import { PecaRepositoryImpl } from "./peca.repository.impl";
import { Peca } from "../../../domain/entities/peca.entity";
import { PecaId } from "../../../shared/types/entity-id";
import { Peca as PecaOrmEntity } from "../entities/peca.entity";
import { PecaMapper } from "../mappers/peca.mapper";

describe("PecaRepositoryImpl", () => {
  let repository: PecaRepositoryImpl;
  let ormRepository: jest.Mocked<Repository<PecaOrmEntity>>;
  let mapper: jest.Mocked<PecaMapper>;

  const domainPeca = {} as Peca;
  const ormPeca = { id: "1" } as PecaOrmEntity;

  beforeEach(() => {
    ormRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<PecaOrmEntity>>;

    mapper = {
      toOrm: jest.fn(),
      toDomain: jest.fn(),
      toDomainArray: jest.fn(),
    } as unknown as jest.Mocked<PecaMapper>;

    repository = new PecaRepositoryImpl(ormRepository, mapper);

    jest.clearAllMocks();
  });

  it("deve salvar peça", async () => {
    mapper.toOrm.mockReturnValue(ormPeca);
    ormRepository.save.mockResolvedValue(ormPeca);

    await repository.salvar(domainPeca);

    expect(mapper.toOrm).toHaveBeenCalledWith(domainPeca);
    expect(ormRepository.save).toHaveBeenCalledWith(ormPeca);
  });

  it("deve buscar por id quando existir", async () => {
    ormRepository.findOne.mockResolvedValue(ormPeca);
    mapper.toDomain.mockReturnValue(domainPeca);

    const result = await repository.buscarPorId(PecaId.criar("1"));

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(mapper.toDomain).toHaveBeenCalledWith(ormPeca);
    expect(result).toBe(domainPeca);
  });

  it("deve retornar null ao buscar por id inexistente", async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.buscarPorId(PecaId.criar("1"));

    expect(result).toBeNull();
  });

  it("deve buscar todas as peças", async () => {
    const ormList = [ormPeca];
    const domainList = [domainPeca];

    ormRepository.find.mockResolvedValue(ormList);
    mapper.toDomainArray.mockReturnValue(domainList);

    const result = await repository.buscarTodos();

    expect(ormRepository.find).toHaveBeenCalled();
    expect(mapper.toDomainArray).toHaveBeenCalledWith(ormList);
    expect(result).toEqual(domainList);
  });

  it("deve excluir peça", async () => {
    ormRepository.delete.mockResolvedValue({} as any);

    await repository.excluir(PecaId.criar("1"));

    expect(ormRepository.delete).toHaveBeenCalledWith({ id: "1" });
  });
});
