import { Peca } from "./peca.entity";
import { BusinessRuleException } from "../../shared/exceptions/domain.exception";
import { PecaId } from "../../shared/types/entity-id";
import { Nome } from "../value-objects/nome.vo";
import { Codigo } from "../value-objects/codigo.vo";
import { Preco } from "../value-objects/preco.vo";
import { Estoque } from "../value-objects/estoque.vo";

describe("Peca Entity", () => {
  describe("criar", () => {
    it("deve criar peça com dados obrigatórios", () => {
      const peca = Peca.criar({
        nome: "Filtro de óleo",
        preco: 50,
      });

      expect(peca.nome.obterValor()).toBe("Filtro de óleo");
      expect(peca.preco.equals(Preco.criar(50))).toBe(true);
      expect(peca.estoque.obterQuantidade()).toBe(0);
      expect(peca.possuiCodigo()).toBe(false);
    });

    it("deve criar peça com código e estoque inicial", () => {
      const peca = Peca.criar({
        nome: "Pastilha de freio",
        codigo: "PF-001",
        preco: 120,
        quantidadeEstoque: 10,
      });

      expect(peca.possuiCodigo()).toBe(true);
      expect(peca.codigo?.obterValor()).toBe("PF-001");
      expect(peca.estoque.obterQuantidade()).toBe(10);
    });
  });

  describe("regras de negócio", () => {
    it("não deve permitir reconstituir sem nome", () => {
      expect(() =>
        Peca.reconstituir({
          id: PecaId.gerar(),
          nome: undefined as any,
          preco: Preco.criar(10),
          estoque: Estoque.criar(1),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow(BusinessRuleException);
    });

    it("não deve permitir reconstituir sem preço", () => {
      expect(() =>
        Peca.reconstituir({
          id: PecaId.gerar(),
          nome: Nome.criar("Teste"),
          preco: undefined as any,
          estoque: Estoque.criar(1),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow(BusinessRuleException);
    });
  });

  describe("atualizações", () => {
    it("deve atualizar nome", () => {
      const peca = Peca.criar({ nome: "Peca", preco: 10 });

      peca.atualizarNome("Nova Peca");

      expect(peca.nome.obterValor()).toBe("Nova Peca");
    });

    it("deve atualizar código", () => {
      const peca = Peca.criar({ nome: "Peca", preco: 10 });

      peca.atualizarCodigo("COD-1");

      expect(peca.codigo?.obterValor()).toBe("COD-1");
    });

    it("deve remover código ao passar undefined", () => {
      const peca = Peca.criar({
        nome: "Peca",
        preco: 10,
        codigo: "COD-1",
      });

      peca.atualizarCodigo(undefined);

      expect(peca.possuiCodigo()).toBe(false);
    });

    it("deve atualizar preço", () => {
      const peca = Peca.criar({ nome: "Peca", preco: 10 });

      peca.atualizarPreco(99);

      expect(peca.preco.equals(Preco.criar(99))).toBe(true);
    });
  });

  describe("estoque", () => {
    it("deve repor estoque", () => {
      const peca = Peca.criar({ nome: "Peca", preco: 10 });

      peca.reporEstoque(5);

      expect(peca.estoque.obterQuantidade()).toBe(5);
    });

    it("deve baixar estoque", () => {
      const peca = Peca.criar({
        nome: "Peca",
        preco: 10,
        quantidadeEstoque: 10,
      });

      peca.baixarEstoque(4);

      expect(peca.estoque.obterQuantidade()).toBe(6);
    });

    it("não deve permitir baixar estoque insuficiente", () => {
      const peca = Peca.criar({
        nome: "Peca",
        preco: 10,
        quantidadeEstoque: 2,
      });

      expect(() => peca.baixarEstoque(5)).toThrow(BusinessRuleException);
    });

    it("deve indicar se tem estoque", () => {
      const peca = Peca.criar({
        nome: "Peca",
        preco: 10,
        quantidadeEstoque: 1,
      });

      expect(peca.temEstoque()).toBe(true);
    });

    it("deve validar estoque suficiente", () => {
      const peca = Peca.criar({
        nome: "Peca",
        preco: 10,
        quantidadeEstoque: 3,
      });

      expect(peca.temEstoqueSuficiente(2)).toBe(true);
      expect(peca.temEstoqueSuficiente(5)).toBe(false);
    });
  });

  describe("cálculos", () => {
    it("deve calcular valor total corretamente", () => {
      const peca = Peca.criar({
        nome: "Peca",
        preco: 10,
      });

      const total = peca.calcularValorTotal(3);

      expect(total.equals(Preco.criar(30))).toBe(true);
    });
  });

  describe("equals", () => {
    it("deve comparar por id", () => {
      const id = PecaId.gerar();

      const agora = new Date();

      const p1 = Peca.reconstituir({
        id,
        nome: Nome.criar("PecaA"),
        preco: Preco.criar(10),
        estoque: Estoque.criar(1),
        createdAt: agora,
        updatedAt: agora,
      });

      const p2 = Peca.reconstituir({
        id,
        nome: Nome.criar("PecaB"),
        preco: Preco.criar(20),
        estoque: Estoque.criar(5),
        createdAt: agora,
        updatedAt: agora,
      });

      expect(p1.equals(p2)).toBe(true);
    });
  });

  describe("snapshot", () => {
    it("deve retornar snapshot completo", () => {
      const peca = Peca.criar({
        nome: "Teste",
        preco: 10,
        quantidadeEstoque: 2,
      });

      const snapshot = peca.toSnapshot();

      expect(snapshot.nome).toBeDefined();
      expect(snapshot.preco).toBeDefined();
      expect(snapshot.estoque).toBeDefined();
      expect(snapshot.createdAt).toBeInstanceOf(Date);
      expect(snapshot.updatedAt).toBeInstanceOf(Date);
    });
  });
});
