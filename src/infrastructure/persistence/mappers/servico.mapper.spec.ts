import { ServicoMapper } from "./servico.mapper";
import { Servico as OrmServico } from "../entities/servico.entity";
import { Servico as DomainServico } from "../../../domain/entities/servico.entity";

import { ServicoId } from "../../../shared/types/entity-id";
import { Nome } from "../../../domain/value-objects/nome.vo";
import { Preco } from "../../../domain/value-objects/preco.vo";

describe("ServicoMapper", () => {
  let mapper: ServicoMapper;

  beforeEach(() => {
    mapper = new ServicoMapper();
  });

  describe("toDomain", () => {
    it("deve mapear corretamente OrmServico para DomainServico", () => {
      const orm = new OrmServico();
      orm.id = "serv-1";
      orm.nome = "Troca de óleo";
      orm.preco = 150;
      orm.createdAt = new Date("2024-01-01");
      orm.updatedAt = new Date("2024-01-02");

      const domain = mapper.toDomain(orm);

      expect(domain.id.obterValor()).toBe("serv-1");
      expect(domain.nome.obterValor()).toBe("Troca de óleo");
      expect(domain.preco.obterValor()).toBe(150);
      expect(domain.createdAt).toEqual(new Date("2024-01-01"));
      expect(domain.updatedAt).toEqual(new Date("2024-01-02"));
    });
  });

  describe("toOrm", () => {
    it("deve mapear corretamente DomainServico para OrmServico", () => {
      const domain = DomainServico.reconstituir({
        id: ServicoId.criar("serv-2"),
        nome: Nome.criar("Alinhamento"),
        preco: Preco.criar(200),
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-02"),
      });

      const orm = mapper.toOrm(domain);

      expect(orm.id).toBe("serv-2");
      expect(orm.nome).toBe("Alinhamento");
      expect(orm.preco).toBe(200);
      expect(orm.createdAt).toEqual(new Date("2024-02-01"));
      expect(orm.updatedAt).toEqual(new Date("2024-02-02"));
    });
  });

  describe("métodos herdados de BaseMapper", () => {
    it("deve mapear array de orm para domain", () => {
      const orm = new OrmServico();
      orm.id = "serv-3";
      orm.nome = "Balanceamento";
      orm.preco = 100;

      const result = mapper.toDomainArray([orm]);

      expect(result).toHaveLength(1);
      expect(result[0].id.obterValor()).toBe("serv-3");
    });

    it("deve mapear array de domain para orm", () => {
      const domain = DomainServico.reconstituir({
        id: ServicoId.criar("serv-4"),
        nome: Nome.criar("Revisão"),
        preco: Preco.criar(500),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = mapper.toOrmArray([domain]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("serv-4");
    });
  });
});
