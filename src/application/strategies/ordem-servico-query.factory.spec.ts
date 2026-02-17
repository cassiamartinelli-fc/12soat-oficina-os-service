import { OrdemServicoQueryFactory } from "./ordem-servico-query.factory";
import {
  BuscarTodasOrdensStrategy,
  BuscarPorClienteStrategy,
  BuscarPorVeiculoStrategy,
  BuscarPorStatusStrategy,
} from "./ordem-servico-query.strategy";
import { BuscarOrdemServicoUseCase } from "../use-cases/ordem-servico";
import { StatusOrdemServico } from "../../domain/value-objects";

describe("OrdemServicoQueryFactory", () => {
  let factory: OrdemServicoQueryFactory;
  let buscarOrdemServicoUseCase: jest.Mocked<BuscarOrdemServicoUseCase>;

  beforeEach(() => {
    buscarOrdemServicoUseCase = {} as jest.Mocked<BuscarOrdemServicoUseCase>;
    factory = new OrdemServicoQueryFactory(buscarOrdemServicoUseCase);
  });

  it("deve retornar BuscarPorClienteStrategy quando clienteId for informado", () => {
    const strategy = factory.createStrategy({ clienteId: "1" });

    expect(strategy).toBeInstanceOf(BuscarPorClienteStrategy);
  });

  it("deve retornar BuscarPorVeiculoStrategy quando veiculoId for informado e clienteId não", () => {
    const strategy = factory.createStrategy({ veiculoId: "2" });

    expect(strategy).toBeInstanceOf(BuscarPorVeiculoStrategy);
  });

  it("deve retornar BuscarPorStatusStrategy quando status for informado e outros não", () => {
    const statusMock = {} as StatusOrdemServico;

    const strategy = factory.createStrategy({ status: statusMock });

    expect(strategy).toBeInstanceOf(BuscarPorStatusStrategy);
  });

  it("deve retornar BuscarTodasOrdensStrategy quando nenhum filtro for informado", () => {
    const strategy = factory.createStrategy({});

    expect(strategy).toBeInstanceOf(BuscarTodasOrdensStrategy);
  });

  it("deve priorizar clienteId sobre os demais filtros", () => {
    const statusMock = {} as StatusOrdemServico;

    const strategy = factory.createStrategy({
      clienteId: "1",
      veiculoId: "2",
      status: statusMock,
    });

    expect(strategy).toBeInstanceOf(BuscarPorClienteStrategy);
  });

  it("deve priorizar veiculoId sobre status quando clienteId não for informado", () => {
    const statusMock = {} as StatusOrdemServico;

    const strategy = factory.createStrategy({
      veiculoId: "2",
      status: statusMock,
    });

    expect(strategy).toBeInstanceOf(BuscarPorVeiculoStrategy);
  });
});
