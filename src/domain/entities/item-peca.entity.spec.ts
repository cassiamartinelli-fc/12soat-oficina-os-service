import { ItemPeca } from "./item-peca.entity";
import { PecaId, OrdemServicoId } from "../../shared/types/entity-id";
import { Quantidade } from "../value-objects/quantidade.vo";
import { Preco } from "../value-objects/preco.vo";
import { BusinessRuleException } from "../../shared/exceptions/domain.exception";

describe("ItemPeca Entity", () => {
  const pecaId = "peca-123";
  const ordemServicoId = "os-456";
  const quantidadeValida = 2;
  const precoValido = 100;

  function criarPreco(valor: number) {
    return Preco.criar(valor);
  }

  describe("criar", () => {
    it("deve criar um item de peça válido", () => {
      const item = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: quantidadeValida,
        },
        criarPreco(precoValido),
      );

      expect(item).toBeInstanceOf(ItemPeca);

      // Testa comportamento ao invés de tipo concreto
      expect(item.pecaId.equals(PecaId.criar(pecaId))).toBe(true);
      expect(
        item.ordemServicoId.equals(OrdemServicoId.criar(ordemServicoId)),
      ).toBe(true);
      expect(item.quantidade.obterValor()).toBe(quantidadeValida);
      expect(item.precoUnitario.obterValor()).toBe(precoValido);
    });
  });

  describe("regras de negócio", () => {
    it("deve lançar erro se preço for zero", () => {
      expect(() =>
        ItemPeca.criar(
          {
            pecaId,
            ordemServicoId,
            quantidade: quantidadeValida,
          },
          criarPreco(0),
        ),
      ).toThrow("Preço não pode ser zero");
    });

    it("deve lançar erro se preço for negativo", () => {
      expect(() =>
        ItemPeca.criar(
          {
            pecaId,
            ordemServicoId,
            quantidade: quantidadeValida,
          },
          criarPreco(-10),
        ),
      ).toThrow("Preço não pode ser negativo");
    });

    it("deve lançar exceção ao reconstituir sem pecaId", () => {
      expect(() =>
        ItemPeca.reconstituir({
          pecaId: undefined as any,
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: Quantidade.criar(quantidadeValida),
          precoUnitario: criarPreco(precoValido),
        }),
      ).toThrow(BusinessRuleException);
    });
  });

  describe("calcularSubtotal", () => {
    it("deve calcular corretamente o subtotal", () => {
      const item = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: 3,
        },
        criarPreco(50),
      );

      const subtotal = item.calcularSubtotal();

      expect(subtotal.obterValor()).toBe(150);
    });
  });

  describe("atualizarQuantidade", () => {
    it("deve retornar nova instância com quantidade atualizada", () => {
      const item = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: 1,
        },
        criarPreco(100),
      );

      const novoItem = item.atualizarQuantidade(5);

      expect(novoItem).not.toBe(item);
      expect(novoItem.quantidade.obterValor()).toBe(5);
      expect(novoItem.precoUnitario.obterValor()).toBe(100);
    });
  });

  describe("pertenceAOrdemServico", () => {
    it("deve retornar true se pertencer à ordem informada", () => {
      const item = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: quantidadeValida,
        },
        criarPreco(precoValido),
      );

      const osId = OrdemServicoId.criar(ordemServicoId);

      expect(item.pertenceAOrdemServico(osId)).toBe(true);
    });

    it("deve retornar false se não pertencer à ordem informada", () => {
      const item = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: quantidadeValida,
        },
        criarPreco(precoValido),
      );

      const outroOsId = OrdemServicoId.criar("outra-os");

      expect(item.pertenceAOrdemServico(outroOsId)).toBe(false);
    });
  });

  describe("equals", () => {
    it("deve considerar iguais quando pecaId e ordemServicoId forem iguais", () => {
      const preco = criarPreco(precoValido);

      const item1 = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: 1,
        },
        preco,
      );

      const item2 = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: 10,
        },
        preco,
      );

      expect(item1.equals(item2)).toBe(true);
    });

    it("deve considerar diferentes quando ids forem diferentes", () => {
      const preco = criarPreco(precoValido);

      const item1 = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: 1,
        },
        preco,
      );

      const item2 = ItemPeca.criar(
        {
          pecaId: "outra-peca",
          ordemServicoId,
          quantidade: 1,
        },
        preco,
      );

      expect(item1.equals(item2)).toBe(false);
    });
  });

  describe("toSnapshot", () => {
    it("deve retornar snapshot completo", () => {
      const item = ItemPeca.criar(
        {
          pecaId,
          ordemServicoId,
          quantidade: quantidadeValida,
        },
        criarPreco(precoValido),
      );

      const snapshot = item.toSnapshot();

      expect(snapshot.pecaId).toBeDefined();
      expect(snapshot.ordemServicoId).toBeDefined();
      expect(snapshot.quantidade).toBeDefined();
      expect(snapshot.precoUnitario).toBeDefined();
    });
  });
});
