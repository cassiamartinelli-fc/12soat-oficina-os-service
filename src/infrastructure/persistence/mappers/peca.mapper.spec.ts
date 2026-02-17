import { PecaMapper } from "./peca.mapper";
import { Peca as OrmPeca } from "../entities/peca.entity";
import { Peca as DomainPeca } from "../../../domain/entities/peca.entity";

import { PecaId } from "../../../shared/types/entity-id";
import { Nome } from "../../../domain/value-objects/nome.vo";
import { Codigo } from "../../../domain/value-objects/codigo.vo";
import { Preco } from "../../../domain/value-objects/preco.vo";
import { Estoque } from "../../../domain/value-objects/estoque.vo";

describe("PecaMapper", () => {
  let mapper: PecaMapper;

  beforeEach(() => {
    mapper = new PecaMapper();
  });

  describe("toDomain", () => {
    it("deve mapear todos os campos corretamente", () => {
      const orm = new OrmPeca();
      orm.id = "peca-1";
      orm.nome = "Filtro de Óleo";
      orm.codigo = "FO-123";
      orm.preco = 59.9;
      orm.quantidadeEstoque = 10;
      orm.createdAt = new Date("2024-01-01");
      orm.updatedAt = new Date("2024-01-02");

      const domain = mapper.toDomain(orm);

      expect(domain.id.obterValor()).toBe("peca-1");
      expect(domain.nome.obterValor()).toBe("Filtro de Óleo");
      expect(domain.codigo?.obterValor()).toBe("FO-123");
      expect(domain.preco.obterValor()).toBe(59.9);
      expect(domain.estoque.obterQuantidade()).toBe(10);
      expect(domain.createdAt).toEqual(new Date("2024-01-01"));
      expect(domain.updatedAt).toEqual(new Date("2024-01-02"));
    });

    it("deve mapear codigo como undefined quando não informado", () => {
      const orm = new OrmPeca();
      orm.id = "peca-2";
      orm.nome = "Pastilha de Freio";
      orm.codigo = undefined;
      orm.preco = 120;
      orm.quantidadeEstoque = 5;

      const domain = mapper.toDomain(orm);

      expect(domain.codigo).toBeUndefined();
    });
  });

  describe("toOrm", () => {
    it("deve mapear todos os campos corretamente", () => {
      const domain = DomainPeca.reconstituir({
        id: PecaId.criar("peca-3"),
        nome: Nome.criar("Amortecedor"),
        codigo: Codigo.criar("AM-999"),
        preco: Preco.criar(300),
        estoque: Estoque.criar(7),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      });

      const orm = mapper.toOrm(domain);

      expect(orm.id).toBe("peca-3");
      expect(orm.nome).toBe("Amortecedor");
      expect(orm.codigo).toBe("AM-999");
      expect(orm.preco).toBe(300);
      expect(orm.quantidadeEstoque).toBe(7);
      expect(orm.createdAt).toEqual(new Date("2024-01-01"));
      expect(orm.updatedAt).toEqual(new Date("2024-01-02"));
    });

    it("deve mapear codigo como undefined quando não existir no domínio", () => {
      const domain = DomainPeca.reconstituir({
        id: PecaId.criar("peca-4"),
        nome: Nome.criar("Correia Dentada"),
        codigo: undefined,
        preco: Preco.criar(150),
        estoque: Estoque.criar(3),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const orm = mapper.toOrm(domain);

      expect(orm.codigo).toBeUndefined();
    });
  });

  describe("métodos herdados de BaseMapper", () => {
    it("deve mapear array de orm para domain", () => {
      const orm = new OrmPeca();
      orm.id = "peca-5";
      orm.nome = "Velas";
      orm.preco = 40;
      orm.quantidadeEstoque = 20;

      const result = mapper.toDomainArray([orm]);

      expect(result).toHaveLength(1);
      expect(result[0].id.obterValor()).toBe("peca-5");
    });

    it("deve mapear array de domain para orm", () => {
      const domain = DomainPeca.reconstituir({
        id: PecaId.criar("peca-6"),
        nome: Nome.criar("Bateria"),
        codigo: undefined,
        preco: Preco.criar(450),
        estoque: Estoque.criar(2),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = mapper.toOrmArray([domain]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("peca-6");
    });
  });
});
