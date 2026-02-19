import { Test, TestingModule } from "@nestjs/testing";
import { OrdemServicoController } from "./ordem-servico.controller";
import { CriarOrdemServicoUseCase } from "../../application/use-cases/ordem-servico/criar-ordem-servico.use-case";
import {
  BuscarOrdemServicoUseCase,
  ExcluirOrdemServicoUseCase,
  AprovarOrcamentoUseCase,
} from "../../application/use-cases/ordem-servico";
import { AtualizarStatusOrdemServicoUseCase } from "../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { ListarOrdensEmAndamentoUseCase } from "../../application/use-cases/ordem-servico/listar-ordens-em-andamento.use-case";
import { OrdemServicoQueryFactory } from "../../application/strategies/ordem-servico-query.factory";
import { OrdemServicoResponseMapper } from "../../application/mappers/ordem-servico-response.mapper";
import { OrdemServicoEmAndamentoMapper } from "../../application/mappers/ordem-servico-em-andamento.mapper";
import { OsCriadaPublisher } from "../../events/publishers/os-criada.publisher";
import { StatusOrdemServico } from "../../domain/value-objects/status-ordem-servico.vo";

describe("OrdemServicoController", () => {
  let controller: OrdemServicoController;

  const criarUseCase = { execute: jest.fn() };
  const buscarUseCase = { buscarPorId: jest.fn() };
  const atualizarStatusUseCase = { execute: jest.fn() };
  const excluirUseCase = { execute: jest.fn() };
  const aprovarUseCase = { execute: jest.fn() };
  const listarEmAndamentoUseCase = { execute: jest.fn() };
  const queryFactory = { createStrategy: jest.fn() };
  const responseMapper = { toDto: jest.fn(), toDtoList: jest.fn() };
  const emAndamentoMapper = { toDtoList: jest.fn() };
  const publisher = { publish: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdemServicoController],
      providers: [
        { provide: CriarOrdemServicoUseCase, useValue: criarUseCase },
        { provide: BuscarOrdemServicoUseCase, useValue: buscarUseCase },
        {
          provide: AtualizarStatusOrdemServicoUseCase,
          useValue: atualizarStatusUseCase,
        },
        { provide: ExcluirOrdemServicoUseCase, useValue: excluirUseCase },
        { provide: AprovarOrcamentoUseCase, useValue: aprovarUseCase },
        {
          provide: ListarOrdensEmAndamentoUseCase,
          useValue: listarEmAndamentoUseCase,
        },
        { provide: OrdemServicoQueryFactory, useValue: queryFactory },
        { provide: OrdemServicoResponseMapper, useValue: responseMapper },
        {
          provide: OrdemServicoEmAndamentoMapper,
          useValue: emAndamentoMapper,
        },
        { provide: OsCriadaPublisher, useValue: publisher },
      ],
    }).compile();

    controller = module.get<OrdemServicoController>(OrdemServicoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("criarOrdemServico", async () => {
    const ordemMock = {
      id: { obterValor: () => "1" },
      clienteId: { obterValor: () => "c1" },
      veiculoId: { obterValor: () => "v1" },
      valorTotal: { obterValor: () => 100 },
    };

    criarUseCase.execute.mockResolvedValue(ordemMock);
    responseMapper.toDto.mockReturnValue({ id: "1" });

    const result = await controller.criarOrdemServico({} as any);

    expect(criarUseCase.execute).toHaveBeenCalled();
    expect(publisher.publish).toHaveBeenCalledWith("1", "c1", "v1", 100);
    expect(result).toEqual({ id: "1" });
  });

  it("listarOrdensServico", async () => {
    const strategy = { execute: jest.fn().mockResolvedValue(["ordem"]) };
    queryFactory.createStrategy.mockReturnValue(strategy);
    responseMapper.toDtoList.mockReturnValue(["dto"]);

    const result = await controller.listarOrdensServico(
      "c1",
      "v1",
      StatusOrdemServico.RECEBIDA,
    );

    expect(queryFactory.createStrategy).toHaveBeenCalledWith({
      clienteId: "c1",
      veiculoId: "v1",
      status: StatusOrdemServico.RECEBIDA,
    });
    expect(result).toEqual(["dto"]);
  });

  it("listarOrdensEmAndamento", async () => {
    listarEmAndamentoUseCase.execute.mockResolvedValue(["ordem"]);
    emAndamentoMapper.toDtoList.mockReturnValue(["dto"]);

    const result = await controller.listarOrdensEmAndamento();

    expect(listarEmAndamentoUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(["dto"]);
  });

  it("buscarOrdemServicoPorId", async () => {
    buscarUseCase.buscarPorId.mockResolvedValue("ordem");
    responseMapper.toDto.mockReturnValue("dto");

    const result = await controller.buscarOrdemServicoPorId("1");

    expect(buscarUseCase.buscarPorId).toHaveBeenCalledWith("1");
    expect(result).toBe("dto");
  });

  it("excluirOrdemServico", async () => {
    const result = await controller.excluirOrdemServico("1");

    expect(excluirUseCase.execute).toHaveBeenCalledWith("1");
    expect(result).toEqual({
      message: "Ordem de serviço excluída com sucesso",
    });
  });

  it("aprovarOrcamento", async () => {
    aprovarUseCase.execute.mockResolvedValue("ordem");
    responseMapper.toDto.mockReturnValue("dto");

    const result = await controller.aprovarOrcamento("1", {
      aprovado: true,
    });

    expect(aprovarUseCase.execute).toHaveBeenCalledWith({
      ordemServicoId: "1",
      aprovado: true,
    });
    expect(result).toBe("dto");
  });

  it("atualizarStatus", async () => {
    atualizarStatusUseCase.execute.mockResolvedValue("ordem");
    responseMapper.toDto.mockReturnValue("dto");

    const result = await controller.atualizarStatus("1", {
      status: StatusOrdemServico.FINALIZADA,
    });

    expect(atualizarStatusUseCase.execute).toHaveBeenCalledWith({
      ordemServicoId: "1",
      novoStatus: StatusOrdemServico.FINALIZADA,
    });
    expect(result).toBe("dto");
  });
});
