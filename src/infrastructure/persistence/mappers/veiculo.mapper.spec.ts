import { Test, TestingModule } from "@nestjs/testing";
import { VeiculoMapper } from "./veiculo.mapper";
import { Veiculo as DomainVeiculo } from "../../../domain/entities/veiculo.entity";
import { Veiculo as OrmVeiculo } from "../entities/veiculo.entity";

describe("VeiculoMapper", () => {
  let mapper: VeiculoMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeiculoMapper],
    }).compile();

    mapper = module.get<VeiculoMapper>(VeiculoMapper);
  });

  const mockDate = new Date();

  const rawData = {
    id: "uuid-veiculo",
    placa: "ABC1234",
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2022,
    clienteId: "uuid-cliente",
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  describe("toDomain", () => {
    it("deve converter uma entidade de infraestrutura (ORM) para o domínio", () => {
      const ormEntity = { ...rawData } as OrmVeiculo;

      const result = mapper.toDomain(ormEntity);

      expect(result).toBeInstanceOf(DomainVeiculo);
      expect(result.id.obterValor()).toBe(rawData.id);
      expect(result.placa.obterValor()).toBe(rawData.placa);
      expect(result.clienteId.obterValor()).toBe(rawData.clienteId);
      expect(result.createdAt).toEqual(mockDate);
    });
  });

  describe("toOrm", () => {
    it("deve converter uma entidade de domínio para a camada de infraestrutura (ORM)", () => {
      const domainEntity = DomainVeiculo.reconstituir({
        id: { obterValor: () => rawData.id } as any,
        placa: { obterValor: () => rawData.placa } as any,
        marca: { obterValor: () => rawData.marca } as any,
        modelo: { obterValor: () => rawData.modelo } as any,
        ano: { obterValor: () => rawData.ano } as any,
        clienteId: { obterValor: () => rawData.clienteId } as any,
        createdAt: rawData.createdAt,
        updatedAt: rawData.updatedAt,
      });

      const result = mapper.toOrm(domainEntity);

      expect(result).toBeInstanceOf(OrmVeiculo);
      expect(result.id).toBe(rawData.id);
      expect(result.placa).toBe(rawData.placa);
      expect(result.marca).toBe(rawData.marca);
      expect(result.modelo).toBe(rawData.modelo);
      expect(result.ano).toBe(rawData.ano);
      expect(result.clienteId).toBe(rawData.clienteId);
      expect(result.createdAt).toEqual(mockDate);
    });
  });
});
