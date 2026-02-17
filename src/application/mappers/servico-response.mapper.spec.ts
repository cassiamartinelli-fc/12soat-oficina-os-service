import { PecaResponseMapper } from "./peca-response.mapper";
import { Peca } from "../../domain/entities";
import { PecaResponseDto } from "../dto/peca/peca-response.dto";

describe("PecaResponseMapper", () => {
  let mapper: PecaResponseMapper;

  const dataCriacao = new Date("2024-01-01T10:00:00Z");
  const dataAtualizacao = new Date("2024-01-02T10:00:00Z");

  const criarPecaMock = (overrides?: Partial<Peca>): Peca =>
    ({
      id: {
        obterValor: jest.fn().mockReturnValue("1"),
      },
      nome: {
        obterValor: jest.fn().mockReturnValue("Filtro de Óleo"),
      },
      codigo: {
        obterValor: jest.fn().mockReturnValue("FO-123"),
      },
      preco: {
        obterValor: jest.fn().mockReturnValue(99.9),
      },
      estoque: {
        obterQuantidade: jest.fn().mockReturnValue(10),
      },
      createdAt: dataCriacao,
      updatedAt: dataAtualizacao,
      ...overrides,
    }) as unknown as Peca;

  beforeEach(() => {
    mapper = new PecaResponseMapper();
    jest.clearAllMocks();
  });

  describe("toDto", () => {
    it("deve mapear corretamente uma peça para DTO", () => {
      const pecaMock = criarPecaMock();

      const result = mapper.toDto(pecaMock);

      const expected: PecaResponseDto = {
        id: "1",
        nome: "Filtro de Óleo",
        codigo: "FO-123",
        preco: 99.9,
        quantidadeEstoque: 10,
        createdAt: dataCriacao,
        updatedAt: dataAtualizacao,
      };

      expect(result).toEqual(expected);
    });

    it("deve mapear codigo como undefined quando não existir", () => {
      const pecaSemCodigo = criarPecaMock({
        codigo: undefined,
      });

      const result = mapper.toDto(pecaSemCodigo);

      expect(result.codigo).toBeUndefined();
    });
  });

  describe("toDtoList", () => {
    it("deve mapear lista de peças corretamente", () => {
      const peca1 = criarPecaMock();
      const peca2 = criarPecaMock({
        id: { obterValor: jest.fn().mockReturnValue("2") },
      } as any);

      const result = mapper.toDtoList([peca1, peca2]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("2");
    });

    it("deve retornar lista vazia quando não houver peças", () => {
      const result = mapper.toDtoList([]);

      expect(result).toEqual([]);
    });
  });
});
