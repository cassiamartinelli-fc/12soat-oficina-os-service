import { ServicoController } from "./servico.controller";
import {
  CriarServicoUseCase,
  BuscarServicoUseCase,
  AtualizarServicoUseCase,
  ExcluirServicoUseCase,
} from "../../application/use-cases/servico";
import { ServicoResponseMapper } from "../../application/mappers/servico-response.mapper";

describe("ServicoController", () => {
  let controller: ServicoController;
  let criarServicoUseCase: jest.Mocked<CriarServicoUseCase>;
  let buscarServicoUseCase: jest.Mocked<BuscarServicoUseCase>;
  let atualizarServicoUseCase: jest.Mocked<AtualizarServicoUseCase>;
  let excluirServicoUseCase: jest.Mocked<ExcluirServicoUseCase>;
  let responseMapper: jest.Mocked<ServicoResponseMapper>;

  beforeEach(() => {
    criarServicoUseCase = { execute: jest.fn() } as any;
    buscarServicoUseCase = {
      buscarTodos: jest.fn(),
      buscarPorId: jest.fn(),
    } as any;
    atualizarServicoUseCase = { execute: jest.fn() } as any;
    excluirServicoUseCase = { execute: jest.fn() } as any;
    responseMapper = { toDto: jest.fn(), toDtoList: jest.fn() } as any;

    controller = new ServicoController(
      criarServicoUseCase,
      buscarServicoUseCase,
      atualizarServicoUseCase,
      excluirServicoUseCase,
      responseMapper,
    );
  });

  it("deve criar serviço", async () => {
    const dto = { nome: "Servico", preco: 100 };
    const domain = { id: "1" };
    const response = { id: "1", ...dto };

    criarServicoUseCase.execute.mockResolvedValue(domain as any);
    responseMapper.toDto.mockReturnValue(response as any);

    const result = await controller.criarServico(dto as any);

    expect(criarServicoUseCase.execute).toHaveBeenCalledWith(dto);
    expect(responseMapper.toDto).toHaveBeenCalledWith(domain);
    expect(result).toEqual(response);
  });

  it("deve listar serviços", async () => {
    const domainList = [{ id: "1" }];
    const responseList = [{ id: "1" }];

    buscarServicoUseCase.buscarTodos.mockResolvedValue(domainList as any);
    responseMapper.toDtoList.mockReturnValue(responseList as any);

    const result = await controller.listarServicos();

    expect(buscarServicoUseCase.buscarTodos).toHaveBeenCalled();
    expect(responseMapper.toDtoList).toHaveBeenCalledWith(domainList);
    expect(result).toEqual(responseList);
  });

  it("deve buscar serviço por id", async () => {
    const domain = { id: "1" };
    const response = { id: "1" };

    buscarServicoUseCase.buscarPorId.mockResolvedValue(domain as any);
    responseMapper.toDto.mockReturnValue(response as any);

    const result = await controller.buscarServicoPorId("1");

    expect(buscarServicoUseCase.buscarPorId).toHaveBeenCalledWith("1");
    expect(responseMapper.toDto).toHaveBeenCalledWith(domain);
    expect(result).toEqual(response);
  });

  it("deve atualizar serviço", async () => {
    const dto = { nome: "Novo", preco: 200 };
    const domain = { id: "1" };
    const response = { id: "1", ...dto };

    atualizarServicoUseCase.execute.mockResolvedValue(domain as any);
    responseMapper.toDto.mockReturnValue(response as any);

    const result = await controller.atualizarServico("1", dto as any);

    expect(atualizarServicoUseCase.execute).toHaveBeenCalledWith({
      id: "1",
      ...dto,
    });
    expect(responseMapper.toDto).toHaveBeenCalledWith(domain);
    expect(result).toEqual(response);
  });

  it("deve excluir serviço", async () => {
    excluirServicoUseCase.execute.mockResolvedValue(undefined);

    const result = await controller.excluirServico("1");

    expect(excluirServicoUseCase.execute).toHaveBeenCalledWith("1");
    expect(result).toEqual({ message: "Serviço excluído com sucesso" });
  });
});
