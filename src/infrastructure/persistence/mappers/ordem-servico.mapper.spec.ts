import { Test, TestingModule } from "@nestjs/testing";
import { OrdemServicoMapper } from "./ordem-servico.mapper";
import { OrdemServico as DomainOrdemServico } from "../../../domain/entities/ordem-servico.entity";
import {
  OrdemServico as OrmOrdemServico,
  StatusOrdemServico,
} from "../entities/ordem-servico.entity";

describe("OrdemServicoMapper", () => {
  let mapper: OrdemServicoMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdemServicoMapper],
    }).compile();

    mapper = module.get<OrdemServicoMapper>(OrdemServicoMapper);
  });

  const mockDate = new Date();

  const createOrmMock = (): OrmOrdemServico => {
    const orm = new OrmOrdemServico();
    orm.id = "os-uuid";
    orm.status = StatusOrdemServico.RECEBIDA;
    orm.valorTotal = 150.5;
    orm.clienteId = "client-uuid";
    orm.veiculoId = "vehicle-uuid";
    orm.dataInicio = mockDate;
    orm.dataFim = mockDate;
    orm.createdAt = mockDate;
    orm.updatedAt = mockDate;
    return orm;
  };

  describe("toDomain", () => {
    it("should map ORM entity to domain entity correctly", () => {
      const ormEntity = createOrmMock();
      const result = mapper.toDomain(ormEntity);

      expect(result).toBeInstanceOf(DomainOrdemServico);
      expect(result.id.obterValor()).toBe(ormEntity.id);
      expect(result.status.obterValor()).toBe(ormEntity.status);
      expect(result.valorTotal.obterValor()).toBe(Number(ormEntity.valorTotal));
    });

    it("should handle nullable and undefined fields", () => {
      const ormEntity = createOrmMock();
      ormEntity.clienteId = null;
      ormEntity.veiculoId = null;
      ormEntity.dataInicio = undefined;
      ormEntity.dataFim = undefined;

      const result = mapper.toDomain(ormEntity);

      expect(result.clienteId).toBeUndefined();
      expect(result.veiculoId).toBeUndefined();
      expect(
        result.periodoExecucao.obterDataInicio() ?? undefined,
      ).toBeUndefined();
    });
  });

  describe("toOrm", () => {
    it("should map domain entity to ORM entity correctly", () => {
      const domainEntity = DomainOrdemServico.reconstituir({
        id: { obterValor: () => "os-uuid" } as any,
        status: { obterValor: () => StatusOrdemServico.FINALIZADA } as any,
        valorTotal: { obterValor: () => 200.0 } as any,
        clienteId: { obterValor: () => "client-uuid" } as any,
        veiculoId: { obterValor: () => "vehicle-uuid" } as any,
        periodoExecucao: {
          obterDataInicio: () => mockDate,
          obterDataFim: () => mockDate,
          calcularDuracaoDias: () => 1,
        } as any,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const result = mapper.toOrm(domainEntity);

      expect(result).toBeInstanceOf(OrmOrdemServico);
      expect(result.id).toBe("os-uuid");
      expect(result.tempoExecucaoMinutos).toBe(1440);
    });

    it("should map optional domain fields to null or undefined in ORM", () => {
      const domainEntity = DomainOrdemServico.reconstituir({
        id: { obterValor: () => "os-uuid" } as any,
        status: { obterValor: () => StatusOrdemServico.RECEBIDA } as any,
        valorTotal: { obterValor: () => 0 } as any,
        clienteId: undefined,
        veiculoId: undefined,
        periodoExecucao: {
          obterDataInicio: () => undefined,
          obterDataFim: () => undefined,
          calcularDuracaoDias: () => null,
        } as any,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const result = mapper.toOrm(domainEntity);

      expect(result.clienteId).toBeNull();
      expect(result.veiculoId).toBeNull();
      expect(result.dataInicio).toBeUndefined();
      expect(result.tempoExecucaoMinutos).toBeUndefined();
    });
  });
});
