import { Servico } from "./servico.entity";
import { ServicoId } from "../../shared/types/entity-id";
import { Nome } from "../value-objects/nome.vo";
import { Preco } from "../value-objects/preco.vo";
import { BusinessRuleException } from "../../shared/exceptions/domain.exception";

describe("Servico Entity", () => {
  describe("criar", () => {
    it("deve criar serviço com nome e preço", () => {
      const servico = Servico.criar({
        nome: "Troca de óleo",
        preco: 150,
      });

      expect(servico.nome.obterValor()).toBe("Troca de óleo");
      expect(servico.preco.equals(Preco.criar(150))).toBe(true);
      expect(servico.createdAt).toBeInstanceOf(Date);
      expect(servico.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("regras de negócio", () => {
    it("não deve permitir reconstituir sem nome", () => {
      expect(() =>
        Servico.reconstituir({
          id: ServicoId.gerar(),
          nome: undefined as any,
          preco: Preco.criar(100),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow(BusinessRuleException);
    });

    it("não deve permitir reconstituir sem preço", () => {
      expect(() =>
        Servico.reconstituir({
          id: ServicoId.gerar(),
          nome: Nome.criar("Servico"),
          preco: undefined as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow(BusinessRuleException);
    });
  });

  describe("atualizações", () => {
    it("deve atualizar nome", () => {
      const servico = Servico.criar({
        nome: "Alinhamento",
        preco: 100,
      });

      servico.atualizarNome("Balanceamento");

      expect(servico.nome.obterValor()).toBe("Balanceamento");
    });

    it("deve atualizar preço", () => {
      const servico = Servico.criar({
        nome: "Alinhamento",
        preco: 100,
      });

      servico.atualizarPreco(200);

      expect(servico.preco.equals(Preco.criar(200))).toBe(true);
    });

    it("deve atualizar updatedAt ao modificar dados", () => {
      const servico = Servico.criar({
        nome: "Alinhamento",
        preco: 100,
      });

      const antes = servico.updatedAt;

      servico.atualizarPreco(150);

      expect(servico.updatedAt.getTime()).toBeGreaterThanOrEqual(
        antes.getTime(),
      );
    });
  });

  describe("cálculos", () => {
    it("deve calcular valor total corretamente", () => {
      const servico = Servico.criar({
        nome: "Lavagem",
        preco: 50,
      });

      const total = servico.calcularValorTotal(3);

      expect(total.equals(Preco.criar(150))).toBe(true);
    });
  });

  describe("equals", () => {
    it("deve considerar iguais serviços com mesmo id", () => {
      const id = ServicoId.gerar();
      const agora = new Date();

      const s1 = Servico.reconstituir({
        id,
        nome: Nome.criar("Servico A"),
        preco: Preco.criar(100),
        createdAt: agora,
        updatedAt: agora,
      });

      const s2 = Servico.reconstituir({
        id,
        nome: Nome.criar("Servico B"),
        preco: Preco.criar(200),
        createdAt: agora,
        updatedAt: agora,
      });

      expect(s1.equals(s2)).toBe(true);
    });

    it("deve considerar diferentes serviços com ids diferentes", () => {
      const s1 = Servico.criar({
        nome: "Servico A",
        preco: 100,
      });

      const s2 = Servico.criar({
        nome: "Servico A",
        preco: 100,
      });

      expect(s1.equals(s2)).toBe(false);
    });
  });

  describe("snapshot", () => {
    it("deve retornar snapshot completo", () => {
      const servico = Servico.criar({
        nome: "Polimento",
        preco: 300,
      });

      const snapshot = servico.toSnapshot();

      expect(snapshot.id).toBeDefined();
      expect(snapshot.nome).toBeDefined();
      expect(snapshot.preco).toBeDefined();
      expect(snapshot.createdAt).toBeInstanceOf(Date);
      expect(snapshot.updatedAt).toBeInstanceOf(Date);
    });
  });
});
