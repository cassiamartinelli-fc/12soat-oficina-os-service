import { ClienteMapper } from "./cliente.mapper";
import { Cliente as OrmCliente } from "../entities/cliente.entity";
import { Cliente as DomainCliente } from "../../../domain/entities/cliente.entity";

import { ClienteId } from "../../../shared/types/entity-id";
import { CpfCnpj, Nome, Telefone } from "../../../domain/value-objects";

describe("ClienteMapper", () => {
  let mapper: ClienteMapper;

  beforeEach(() => {
    mapper = new ClienteMapper();
    jest.restoreAllMocks();
  });

  describe("toDomain", () => {
    it("deve converter OrmCliente para DomainCliente com telefone", () => {
      const orm = new OrmCliente();
      orm.id = "1";
      orm.nome = "João";
      orm.cpfCnpj = "52998224725"; // CPF válido
      orm.telefone = "11999999999";
      orm.createdAt = new Date();
      orm.updatedAt = new Date();

      const domain = mapper.toDomain(orm);

      expect(domain.id.obterValor()).toBe("1");
      expect(domain.nome.obterValor()).toBe("João");
      expect(domain.cpfCnpj.obterValor()).toBe("52998224725");
      expect(domain.telefone?.obterValor()).toBe("11999999999");
      expect(domain.createdAt).toBe(orm.createdAt);
      expect(domain.updatedAt).toBe(orm.updatedAt);
    });

    it("deve converter OrmCliente para DomainCliente sem telefone", () => {
      const orm = new OrmCliente();
      orm.id = "1";
      orm.nome = "Maria";
      orm.cpfCnpj = "52998224725";
      orm.telefone = undefined;
      orm.createdAt = new Date();
      orm.updatedAt = new Date();

      const domain = mapper.toDomain(orm);

      expect(domain.telefone).toBeUndefined();
    });
  });

  describe("toOrm", () => {
    it("deve converter DomainCliente para OrmCliente com telefone", () => {
      const domain = DomainCliente.reconstituir({
        id: ClienteId.criar("1"),
        nome: Nome.criar("João"),
        cpfCnpj: CpfCnpj.criar("52998224725"),
        telefone: Telefone.criar("11999999999"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const orm = mapper.toOrm(domain);

      expect(orm.id).toBe("1");
      expect(orm.nome).toBe("João");
      expect(orm.cpfCnpj).toBe("52998224725");
      expect(orm.telefone).toBe("11999999999");
      expect(orm.createdAt).toBe(domain.createdAt);
      expect(orm.updatedAt).toBe(domain.updatedAt);
    });

    it("deve converter DomainCliente para OrmCliente sem telefone", () => {
      const domain = DomainCliente.reconstituir({
        id: ClienteId.criar("1"),
        nome: Nome.criar("Maria"),
        cpfCnpj: CpfCnpj.criar("52998224725"),
        telefone: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const orm = mapper.toOrm(domain);

      expect(orm.telefone).toBeUndefined();
    });
  });
});
