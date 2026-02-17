import { Cliente } from "./cliente.entity";
import { ClienteId } from "../../shared/types/entity-id";
import { CpfCnpj, Nome, Telefone } from "../value-objects";
import { BusinessRuleException } from "../../shared/exceptions/domain.exception";

describe("Cliente Entity", () => {
  const cpfValido = "52998224725";
  const cnpjValido = "11222333000181";
  const nomeValido = "João da Silva";
  const telefoneValido = "11999999999";

  describe("criar", () => {
    it("deve criar um cliente válido com CPF", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
        telefone: telefoneValido,
      });

      expect(cliente.nome.obterValor()).toBe(nomeValido);
      expect(cliente.cpfCnpj.obterValor()).toBe(cpfValido);
      expect(cliente.telefone?.obterValor()).toBe(telefoneValido);

      expect(cliente.createdAt).toBeInstanceOf(Date);
      expect(cliente.updatedAt).toBeInstanceOf(Date);
    });

    it("deve criar cliente sem telefone", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
      });

      expect(cliente.telefone).toBeUndefined();
      expect(cliente.possuiTelefone()).toBe(false);
    });
  });

  describe("reconstituir", () => {
    it("deve reconstituir cliente existente", () => {
      const agora = new Date();

      const cliente = Cliente.reconstituir({
        id: ClienteId.gerar(),
        nome: Nome.criar(nomeValido),
        cpfCnpj: CpfCnpj.criar(cpfValido),
        telefone: Telefone.criar(telefoneValido),
        createdAt: agora,
        updatedAt: agora,
      });

      expect(cliente.nome.obterValor()).toBe(nomeValido);
      expect(cliente.cpfCnpj.obterValor()).toBe(cpfValido);
    });
  });

  describe("regras de negócio", () => {
    it("deve lançar erro se nome estiver ausente", () => {
      expect(() =>
        Cliente.reconstituir({
          id: ClienteId.gerar(),
          nome: undefined as any,
          cpfCnpj: CpfCnpj.criar(cpfValido),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow(BusinessRuleException);
    });

    it("deve lançar erro se cpfCnpj estiver ausente", () => {
      expect(() =>
        Cliente.reconstituir({
          id: ClienteId.gerar(),
          nome: Nome.criar(nomeValido),
          cpfCnpj: undefined as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow(BusinessRuleException);
    });
  });

  describe("atualizações", () => {
    it("deve atualizar nome", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
      });

      cliente.atualizarNome("Maria Oliveira");

      expect(cliente.nome.obterValor()).toBe("Maria Oliveira");
    });

    it("deve atualizar telefone", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
      });

      cliente.atualizarTelefone(telefoneValido);

      expect(cliente.telefone?.obterValor()).toBe(telefoneValido);
      expect(cliente.possuiTelefone()).toBe(true);
    });

    it("deve remover telefone", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
        telefone: telefoneValido,
      });

      cliente.atualizarTelefone(undefined);

      expect(cliente.telefone).toBeUndefined();
      expect(cliente.possuiTelefone()).toBe(false);
    });

    it("deve atualizar cpfCnpj", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
      });

      cliente.atualizarCpfCnpj(cnpjValido);

      expect(cliente.cpfCnpj.obterValor()).toBe(cnpjValido);
    });
  });

  describe("métodos auxiliares", () => {
    it("deve identificar pessoa física", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
      });

      expect(cliente.isPessoaFisica()).toBe(true);
      expect(cliente.isPessoaJuridica()).toBe(false);
    });

    it("deve identificar pessoa jurídica", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cnpjValido,
      });

      expect(cliente.isPessoaJuridica()).toBe(true);
      expect(cliente.isPessoaFisica()).toBe(false);
    });

    it("deve comparar igualdade por id", () => {
      const cliente1 = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
      });

      const cliente2 = Cliente.reconstituir(cliente1.toSnapshot());

      expect(cliente1.equals(cliente2)).toBe(true);
    });
  });

  describe("toSnapshot", () => {
    it("deve retornar snapshot completo", () => {
      const cliente = Cliente.criar({
        nome: nomeValido,
        cpfCnpj: cpfValido,
        telefone: telefoneValido,
      });

      const snapshot = cliente.toSnapshot();

      expect(snapshot.id).toBeDefined();
      expect(snapshot.nome).toBeDefined();
      expect(snapshot.cpfCnpj).toBeDefined();
      expect(snapshot.telefone).toBeDefined();
      expect(snapshot.createdAt).toBeInstanceOf(Date);
      expect(snapshot.updatedAt).toBeInstanceOf(Date);
    });
  });
});
