import { Repository, SelectQueryBuilder, DeleteResult } from "typeorm";
import { OrdemServicoRepositoryImpl } from "./ordem-servico.repository.impl";

import { OrdemServico } from "../../../domain/entities/ordem-servico.entity";
import { ItemServico } from "../../../domain/entities/item-servico.entity";
import { ItemPeca } from "../../../domain/entities/item-peca.entity";

import {
  OrdemServicoId,
  ClienteId,
  VeiculoId,
} from "../../../shared/types/entity-id";

import { StatusOrdemServico } from "../../../domain/value-objects/status-ordem-servico.vo";

import { OrdemServico as OrdemServicoOrm } from "../entities/ordem-servico.entity";
import { ItemOrdemServico as ItemServicoOrm } from "../entities/item-ordem-servico.entity";
import { PecaOrdemServico as ItemPecaOrm } from "../entities/peca-ordem-servico.entity";

import { OrdemServicoMapper } from "../mappers/ordem-servico.mapper";
import { ItemServicoMapper } from "../mappers/item-servico.mapper";
import { ItemPecaMapper } from "../mappers/item-peca.mapper";

describe("OrdemServicoRepositoryImpl", () => {
  let repository: OrdemServicoRepositoryImpl;

  let ordemRepo: jest.Mocked<Repository<OrdemServicoOrm>>;
  let itemServicoRepo: jest.Mocked<Repository<ItemServicoOrm>>;
  let itemPecaRepo: jest.Mocked<Repository<ItemPecaOrm>>;

  let ordemMapper: jest.Mocked<OrdemServicoMapper>;
  let itemServicoMapper: jest.Mocked<ItemServicoMapper>;
  let itemPecaMapper: jest.Mocked<ItemPecaMapper>;

  const domainOrdem = {} as OrdemServico;
  const domainItemServico = {} as ItemServico;
  const domainItemPeca = {} as ItemPeca;

  const ormOrdem = {} as OrdemServicoOrm;
  const ormItemServico = {} as ItemServicoOrm;
  const ormItemPeca = {} as ItemPecaOrm;

  beforeEach(() => {
    ordemRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<Repository<OrdemServicoOrm>>;

    itemServicoRepo = {
      save: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<ItemServicoOrm>>;

    itemPecaRepo = {
      save: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<ItemPecaOrm>>;

    ordemMapper = {
      toOrm: jest.fn(),
      toDomain: jest.fn(),
      toDomainArray: jest.fn(),
    } as unknown as jest.Mocked<OrdemServicoMapper>;

    itemServicoMapper = {
      toOrm: jest.fn(),
      toDomainArray: jest.fn(),
    } as unknown as jest.Mocked<ItemServicoMapper>;

    itemPecaMapper = {
      toOrm: jest.fn(),
      toDomainArray: jest.fn(),
    } as unknown as jest.Mocked<ItemPecaMapper>;

    repository = new OrdemServicoRepositoryImpl(
      ordemRepo,
      itemServicoRepo,
      itemPecaRepo,
      ordemMapper,
      itemServicoMapper,
      itemPecaMapper,
    );

    jest.clearAllMocks();
  });

  it("deve salvar ordem", async () => {
    ordemMapper.toOrm.mockReturnValue(ormOrdem);
    ordemRepo.save.mockResolvedValue(ormOrdem);

    await repository.salvar(domainOrdem);

    expect(ordemRepo.save).toHaveBeenCalledWith(ormOrdem);
  });

  it("deve buscar por id existente", async () => {
    ordemRepo.findOne.mockResolvedValue(ormOrdem);
    ordemMapper.toDomain.mockReturnValue(domainOrdem);

    const result = await repository.buscarPorId(OrdemServicoId.criar("1"));

    expect(result).toBe(domainOrdem);
  });

  it("deve retornar null se id não existir", async () => {
    ordemRepo.findOne.mockResolvedValue(null);

    const result = await repository.buscarPorId(OrdemServicoId.criar("1"));

    expect(result).toBeNull();
  });

  it("deve buscar todos", async () => {
    ordemRepo.find.mockResolvedValue([ormOrdem]);
    ordemMapper.toDomainArray.mockReturnValue([domainOrdem]);

    const result = await repository.buscarTodos();

    expect(result).toHaveLength(1);
  });

  it("deve buscar por cliente", async () => {
    ordemRepo.find.mockResolvedValue([ormOrdem]);
    ordemMapper.toDomainArray.mockReturnValue([domainOrdem]);

    await repository.buscarPorCliente(ClienteId.criar("c1"));

    expect(ordemRepo.find).toHaveBeenCalledWith({
      where: { clienteId: "c1" },
    });
  });

  it("deve buscar por veiculo", async () => {
    ordemRepo.find.mockResolvedValue([ormOrdem]);
    ordemMapper.toDomainArray.mockReturnValue([domainOrdem]);

    await repository.buscarPorVeiculo(VeiculoId.criar("v1"));

    expect(ordemRepo.find).toHaveBeenCalledWith({
      where: { veiculoId: "v1" },
    });
  });

  it("deve buscar por status", async () => {
    ordemRepo.find.mockResolvedValue([ormOrdem]);
    ordemMapper.toDomainArray.mockReturnValue([domainOrdem]);

    const status = {} as StatusOrdemServico;

    await repository.buscarPorStatus(status);

    expect(ordemRepo.find).toHaveBeenCalledWith({
      where: { status },
    });
  });

  it("deve excluir ordem", async () => {
    ordemRepo.delete.mockResolvedValue({} as DeleteResult);

    await repository.excluir(OrdemServicoId.criar("1"));

    expect(ordemRepo.delete).toHaveBeenCalledWith({ id: "1" });
  });

  it("deve buscar ordens em andamento", async () => {
    const qb: Partial<SelectQueryBuilder<OrdemServicoOrm>> = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([ormOrdem]),
    };

    ordemRepo.createQueryBuilder.mockReturnValue(
      qb as SelectQueryBuilder<OrdemServicoOrm>,
    );

    ordemMapper.toDomainArray.mockReturnValue([domainOrdem]);

    const result = await repository.buscarOrdensEmAndamento();

    expect(result).toHaveLength(1);
  });

  it("deve adicionar item serviço", async () => {
    itemServicoMapper.toOrm.mockReturnValue(ormItemServico);
    itemServicoRepo.save.mockResolvedValue(ormItemServico);

    await repository.adicionarItemServico(domainItemServico);

    expect(itemServicoRepo.save).toHaveBeenCalledWith(ormItemServico);
  });

  it("deve adicionar item peça", async () => {
    itemPecaMapper.toOrm.mockReturnValue(ormItemPeca);
    itemPecaRepo.save.mockResolvedValue(ormItemPeca);

    await repository.adicionarItemPeca(domainItemPeca);

    expect(itemPecaRepo.save).toHaveBeenCalledWith(ormItemPeca);
  });

  it("deve buscar itens serviço", async () => {
    itemServicoRepo.find.mockResolvedValue([ormItemServico]);
    itemServicoMapper.toDomainArray.mockReturnValue([domainItemServico]);

    const result = await repository.buscarItensServico(
      OrdemServicoId.criar("1"),
    );

    expect(result).toHaveLength(1);
  });

  it("deve buscar itens peça", async () => {
    itemPecaRepo.find.mockResolvedValue([ormItemPeca]);
    itemPecaMapper.toDomainArray.mockReturnValue([domainItemPeca]);

    const result = await repository.buscarItensPeca(OrdemServicoId.criar("1"));

    expect(result).toHaveLength(1);
  });

  it("deve remover item serviço", async () => {
    itemServicoRepo.delete.mockResolvedValue({} as DeleteResult);

    await repository.removerItemServico(OrdemServicoId.criar("1"), "serv1");

    expect(itemServicoRepo.delete).toHaveBeenCalledWith({
      ordemServicoId: "1",
      servicoId: "serv1",
    });
  });

  it("deve remover item peça", async () => {
    itemPecaRepo.delete.mockResolvedValue({} as DeleteResult);

    await repository.removerItemPeca(OrdemServicoId.criar("1"), "pec1");

    expect(itemPecaRepo.delete).toHaveBeenCalledWith({
      ordemServicoId: "1",
      pecaId: "pec1",
    });
  });
});
