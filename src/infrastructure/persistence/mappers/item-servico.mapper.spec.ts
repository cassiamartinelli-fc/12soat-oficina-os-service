import { ItemServicoMapper } from "./item-servico.mapper";
import { ItemOrdemServico as OrmItemOrdemServico } from "../entities/item-ordem-servico.entity";
import { ItemServico as DomainItemServico } from "../../../domain/entities/item-servico.entity";

import { ServicoId, OrdemServicoId } from "../../../shared/types/entity-id";
import { Quantidade } from "../../../domain/value-objects/quantidade.vo";
import { Preco } from "../../../domain/value-objects/preco.vo";

describe("ItemServicoMapper", () => {
  let mapper: ItemServicoMapper;

  beforeEach(() => {
    mapper = new ItemServicoMapper();
  });

  describe("toDomain", () => {
    it("deve converter OrmItemOrdemServico para DomainItemServico", () => {
      const orm = new OrmItemOrdemServico();
      orm.servicoId = "s1";
      orm.ordemServicoId = "os1";
      orm.quantidade = 2;
      orm.precoUnitario = 150;

      const domain = mapper.toDomain(orm);

      expect(domain.servicoId.obterValor()).toBe("s1");
      expect(domain.ordemServicoId.obterValor()).toBe("os1");
      expect(domain.quantidade.obterValor()).toBe(2);
      expect(domain.precoUnitario.obterValor()).toBe(150);
    });
  });

  describe("toOrm", () => {
    it("deve converter DomainItemServico para OrmItemOrdemServico e calcular subtotal", () => {
      const domain = DomainItemServico.reconstituir({
        servicoId: ServicoId.criar("s1"),
        ordemServicoId: OrdemServicoId.criar("os1"),
        quantidade: Quantidade.criar(3),
        precoUnitario: Preco.criar(200),
      });

      const orm = mapper.toOrm(domain);

      expect(orm.servicoId).toBe("s1");
      expect(orm.ordemServicoId).toBe("os1");
      expect(orm.quantidade).toBe(3);
      expect(orm.precoUnitario).toBe(200);
      expect(orm.subtotal).toBe(600);
    });
  });

  describe("arrays herdados de BaseMapper", () => {
    it("deve converter array orm para domain", () => {
      const orm = new OrmItemOrdemServico();
      orm.servicoId = "s1";
      orm.ordemServicoId = "os1";
      orm.quantidade = 1;
      orm.precoUnitario = 100;

      const result = mapper.toDomainArray([orm]);

      expect(result).toHaveLength(1);
      expect(result[0].servicoId.obterValor()).toBe("s1");
    });

    it("deve converter array domain para orm", () => {
      const domain = DomainItemServico.reconstituir({
        servicoId: ServicoId.criar("s1"),
        ordemServicoId: OrdemServicoId.criar("os1"),
        quantidade: Quantidade.criar(2),
        precoUnitario: Preco.criar(50),
      });

      const result = mapper.toOrmArray([domain]);

      expect(result).toHaveLength(1);
      expect(result[0].subtotal).toBe(100);
    });
  });
});
