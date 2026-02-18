import { PecaController } from "./peca.controller";
import {
  CriarPecaUseCase,
  BuscarPecaUseCase,
  AtualizarPecaUseCase,
  ExcluirPecaUseCase,
} from "../../application/use-cases/peca";
import { PecaResponseMapper } from "../../application/mappers/peca-response.mapper";

describe("PecaController", () => {
  let controller: PecaController;
  let criarPecaUseCase: jest.Mocked<CriarPecaUseCase>;
  let buscarPecaUseCase: jest.Mocked<BuscarPecaUseCase>;
  let atualizarPecaUseCase: jest.Mocked<AtualizarPecaUseCase>;
  let excluirPecaUseCase: jest.Mocked<ExcluirPecaUseCase>;
  let responseMapper: jest.Mocked<PecaResponseMapper>;

  beforeEach(() => {
    criarPecaUseCase = { execute: jest.fn() } as any;
    buscarPecaUseCase = {
      buscarTodos: jest.fn(),
      buscarPorId: jest.fn(),
    } as any;
    atualizarPecaUseCase = { execute: jest.fn() } as any;
    excluirPecaUseCase = { execute: jest.fn() } as any;
    responseMapper = { toDto: jest.fn(), toDtoList: jest.fn() } as any;

    controller = new PecaController(
      criarPecaUseCase,
      buscarPecaUseCase,
      atualizarPecaUseCase,
      excluirPecaUseCase,
      responseMapper,
    );
  });

  it("deve criar peça", async () => {
    const dto = {
      nome: "Peca",
      codigo: "123",
      preco: 10,
      quantidadeEstoque: 5,
    };
    const domain = { id: "1" };
    const response = { id: "1", ...dto };

    criarPecaUseCase.execute.mockResolvedValue(domain as any);
    responseMapper.toDto.mockReturnValue(response as any);

    const result = await controller.criarPeca(dto as any);

    expect(criarPecaUseCase.execute).toHaveBeenCalledWith(dto);
    expect(responseMapper.toDto).toHaveBeenCalledWith(domain);
    expect(result).toEqual(response);
  });

  it("deve listar peças", async () => {
    const domainList = [{ id: "1" }];
    const responseList = [{ id: "1" }];

    buscarPecaUseCase.buscarTodos.mockResolvedValue(domainList as any);
    responseMapper.toDtoList.mockReturnValue(responseList as any);

    const result = await controller.listarPecas();

    expect(buscarPecaUseCase.buscarTodos).toHaveBeenCalled();
    expect(responseMapper.toDtoList).toHaveBeenCalledWith(domainList);
    expect(result).toEqual(responseList);
  });

  it("deve buscar peça por id", async () => {
    const domain = { id: "1" };
    const response = { id: "1" };

    buscarPecaUseCase.buscarPorId.mockResolvedValue(domain as any);
    responseMapper.toDto.mockReturnValue(response as any);

    const result = await controller.buscarPecaPorId("1");

    expect(buscarPecaUseCase.buscarPorId).toHaveBeenCalledWith("1");
    expect(responseMapper.toDto).toHaveBeenCalledWith(domain);
    expect(result).toEqual(response);
  });

  it("deve atualizar peça", async () => {
    const dto = {
      nome: "Nova",
      codigo: "123",
      preco: 20,
      quantidadeEstoque: 10,
    };
    const domain = { id: "1" };
    const response = { id: "1", ...dto };

    atualizarPecaUseCase.execute.mockResolvedValue(domain as any);
    responseMapper.toDto.mockReturnValue(response as any);

    const result = await controller.atualizarPeca("1", dto as any);

    expect(atualizarPecaUseCase.execute).toHaveBeenCalledWith({
      id: "1",
      ...dto,
    });
    expect(responseMapper.toDto).toHaveBeenCalledWith(domain);
    expect(result).toEqual(response);
  });

  it("deve excluir peça", async () => {
    excluirPecaUseCase.execute.mockResolvedValue(undefined);

    const result = await controller.excluirPeca("1");

    expect(excluirPecaUseCase.execute).toHaveBeenCalledWith("1");
    expect(result).toEqual({ message: "Peça excluída com sucesso" });
  });
});
