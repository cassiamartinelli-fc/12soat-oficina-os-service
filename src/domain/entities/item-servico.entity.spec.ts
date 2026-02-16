import { ItemServico } from "./item-servico.entity";
import { ServicoId, OrdemServicoId } from "../../shared/types/entity-id";
import { Quantidade } from "../value-objects/quantidade.vo";
import { Preco } from "../value-objects/preco.vo";
import { BusinessRuleException } from "../../shared/exceptions/domain.exception";

describe("ItemServico Entity", () => {
  const servicoId = "servico-123";
  const ordemServicoId = "os-456";
  const quantidadeValida = 2;
  const precoValido = 100;

  function criarPreco(valor: number) {
    return Preco.criar(valor);
  }

  describe("criar", () => {
    it("deve criar um item de serviço válido", () => {
      const item = ItemServico.criar(
        {
          servicoId,
          ordemServicoId,
          quantidade: quantidadeValida,
        },
        criarPreco(precoValido),
      );

      expect(item.servicoId.equals(ServicoId.criar(servicoId))).toBe(true);
      expect(
        item.ordemServicoId.equals(OrdemServicoId.criar(ordemServicoId)),
      ).toBe(true);
      expect(item.quantidade.obterValor()).toBe(quantidadeValida);
      expect(item.precoUnitario.obterValor()).toBe(precoValido);
    });
  });

  describe("regras de negócio", () => {
    it("deve lançar erro se preço unitário for zero", () => {
      expect(() =>
        ItemServico.criar(
          {
            servicoId,
            ordemServicoId,
            quantidade: quantidadeValida,
          },
          criarPreco(0),
        ),
      ).toThrow("Preço não pode ser zero");
    });

    it("deve lançar erro se preço unitário for negativo", () => {
      expect(() =>
        ItemServico.criar(
          {
            servicoId,
            ordemServicoId,
            quantidade: quantidadeValida,
          },
          criarPreco(-10),
        ),
      ).toThrow("Preço não pode ser negativo");
    });

    it("deve lançar erro ao reconstituir sem servicoId", () => {
      expect(() =>
        ItemServico.reconstituir({
          servicoId: undefined as any,
          ordemServicoId: OrdemServicoId.criar(ordemServicoId),
          quantidade: Quantidade.criar(quantidadeValida),
          precoUnitario: criarPreco(precoValido),
        }),
      ).toThrow(BusinessRuleException);
    });

    it("deve lançar erro ao reconstituir sem ordemServicoId", () => {
      expect(() =>
        ItemServico.reconstituir({
          servicoId: ServicoId.criar(servicoId),
          ordemServicoId: undefined as any,
          quantidade: Quantidade.criar(quantidadeValida),
          precoUnitario: criarPreco(precoValido),
        }),
      ).toThrow(BusinessRuleException);
    });
  });

  describe("calcularSubtotal", () => {
    it("deve calcular corretamente o subtotal", () => {
      const item = ItemServico.criar(
        {
          servicoId,
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
      const item = ItemServico.criar(
        {
          servicoId,
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
      const item = ItemServico.criar(
        {
          servicoId,
          ordemServicoId,
          quantidade: quantidadeValida,
        },
        criarPreco(precoValido),
      );

      const osId = OrdemServicoId.criar(ordemServicoId);

      expect(item.pertenceAOrdemServico(osId)).toBe(true);
    });

    it("deve retornar false se não pertencer à ordem informada", () => {
      const item = ItemServico.criar(
        {
          servicoId,
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
    it("deve considerar iguais quando servicoId e ordemServicoId forem iguais", () => {
      const preco = criarPreco(precoValido);

      const item1 = ItemServico.criar(
        {
          servicoId,
          ordemServicoId,
          quantidade: 1,
        },
        preco,
      );

      const item2 = ItemServico.criar(
        {
          servicoId,
          ordemServicoId,
          quantidade: 10,
        },
        preco,
      );

      expect(item1.equals(item2)).toBe(true);
    });

    it("deve considerar diferentes quando ids forem diferentes", () => {
      const preco = criarPreco(precoValido);

      const item1 = ItemServico.criar(
        {
          servicoId,
          ordemServicoId,
          quantidade: 1,
        },
        preco,
      );

      const item2 = ItemServico.criar(
        {
          servicoId: "outro-servico",
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
      const item = ItemServico.criar(
        {
          servicoId,
          ordemServicoId,
          quantidade: quantidadeValida,
        },
        criarPreco(precoValido),
      );

      const snapshot = item.toSnapshot();

      expect(snapshot.servicoId).toBeDefined();
      expect(snapshot.ordemServicoId).toBeDefined();
      expect(snapshot.quantidade).toBeDefined();
      expect(snapshot.precoUnitario).toBeDefined();
    });
  });
});
