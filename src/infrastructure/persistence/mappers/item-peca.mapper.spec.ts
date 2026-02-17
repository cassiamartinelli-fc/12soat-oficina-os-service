import { ItemPecaMapper } from "./item-peca.mapper";
import { PecaOrdemServico as OrmPecaOrdemServico } from "../entities/peca-ordem-servico.entity";
import { ItemPeca as DomainItemPeca } from "../../../domain/entities/item-peca.entity";

import { PecaId, OrdemServicoId } from "../../../shared/types/entity-id";
import { Quantidade } from "../../../domain/value-objects/quantidade.vo";
import { Preco } from "../../../domain/value-objects/preco.vo";

describe("ItemPecaMapper", () => {
  let mapper: ItemPecaMapper;

  beforeEach(() => {
    mapper = new ItemPecaMapper();
  });

  describe("toDomain", () => {
    it("deve converter OrmPecaOrdemServico para DomainItemPeca", () => {
      const orm = new OrmPecaOrdemServico();
      orm.pecaId = "p1";
      orm.ordemServicoId = "os1";
      orm.quantidade = 2;
      orm.precoUnitario = 50;

      const domain = mapper.toDomain(orm);

      expect(domain.pecaId.obterValor()).toBe("p1");
      expect(domain.ordemServicoId.obterValor()).toBe("os1");
      expect(domain.quantidade.obterValor()).toBe(2);
      expect(domain.precoUnitario.obterValor()).toBe(50);
    });
  });

  describe("toOrm", () => {
    it("deve converter DomainItemPeca para OrmPecaOrdemServico e calcular subtotal", () => {
      const domain = DomainItemPeca.reconstituir({
        pecaId: PecaId.criar("p1"),
        ordemServicoId: OrdemServicoId.criar("os1"),
        quantidade: Quantidade.criar(3),
        precoUnitario: Preco.criar(100),
      });

      const orm = mapper.toOrm(domain);

      expect(orm.pecaId).toBe("p1");
      expect(orm.ordemServicoId).toBe("os1");
      expect(orm.quantidade).toBe(3);
      expect(orm.precoUnitario).toBe(100);
      expect(orm.subtotal).toBe(300);
    });
  });

  describe("arrays herdados de BaseMapper", () => {
    it("deve converter array orm para domain", () => {
      const orm = new OrmPecaOrdemServico();
      orm.pecaId = "p1";
      orm.ordemServicoId = "os1";
      orm.quantidade = 1;
      orm.precoUnitario = 10;

      const result = mapper.toDomainArray([orm]);

      expect(result).toHaveLength(1);
      expect(result[0].pecaId.obterValor()).toBe("p1");
    });

    it("deve converter array domain para orm", () => {
      const domain = DomainItemPeca.reconstituir({
        pecaId: PecaId.criar("p1"),
        ordemServicoId: OrdemServicoId.criar("os1"),
        quantidade: Quantidade.criar(2),
        precoUnitario: Preco.criar(5),
      });

      const result = mapper.toOrmArray([domain]);

      expect(result).toHaveLength(1);
      expect(result[0].subtotal).toBe(10);
    });
  });
});
