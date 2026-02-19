import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { OrdemServicoDddModule } from "./ordem-servico-ddd.module";
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from "./ddd.module";
import { OrdemServico as OrdemServicoOrmEntity } from "./persistence/entities/ordem-servico.entity";
import { ItemOrdemServico as ItemOrdemServicoOrmEntity } from "./persistence/entities/item-ordem-servico.entity";
import { PecaOrdemServico as PecaOrdemServicoOrmEntity } from "./persistence/entities/peca-ordem-servico.entity";
import { CriarOrdemServicoUseCase } from "../application/use-cases/ordem-servico/criar-ordem-servico.use-case";
import { BuscarOrdemServicoUseCase } from "../application/use-cases/ordem-servico";
import { AtualizarStatusOrdemServicoUseCase } from "../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { ExcluirOrdemServicoUseCase } from "../application/use-cases/ordem-servico";
import { AprovarOrcamentoUseCase } from "../application/use-cases/ordem-servico";
import { OsCriadaPublisher } from "../events/publishers/os-criada.publisher";

describe("OrdemServicoDddModule", () => {
  let module: TestingModule;

  const repositoryMock = {};
  const dataSourceMock = {
    createQueryRunner: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [OrdemServicoDddModule],
    })
      .overrideProvider(getRepositoryToken(OrdemServicoOrmEntity))
      .useValue(repositoryMock)
      .overrideProvider(getRepositoryToken(ItemOrdemServicoOrmEntity))
      .useValue(repositoryMock)
      .overrideProvider(getRepositoryToken(PecaOrdemServicoOrmEntity))
      .useValue(repositoryMock)
      .overrideProvider("DataSource")
      .useValue(dataSourceMock)
      .compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should provide ORDEM_SERVICO_REPOSITORY_TOKEN", () => {
    const repository = module.get(ORDEM_SERVICO_REPOSITORY_TOKEN);
    expect(repository).toBeDefined();
  });

  it("should export CriarOrdemServicoUseCase", () => {
    const useCase = module.get(CriarOrdemServicoUseCase);
    expect(useCase).toBeDefined();
  });

  it("should export BuscarOrdemServicoUseCase", () => {
    const useCase = module.get(BuscarOrdemServicoUseCase);
    expect(useCase).toBeDefined();
  });

  it("should export AtualizarStatusOrdemServicoUseCase", () => {
    const useCase = module.get(AtualizarStatusOrdemServicoUseCase);
    expect(useCase).toBeDefined();
  });

  it("should export ExcluirOrdemServicoUseCase", () => {
    const useCase = module.get(ExcluirOrdemServicoUseCase);
    expect(useCase).toBeDefined();
  });

  it("should export AprovarOrcamentoUseCase", () => {
    const useCase = module.get(AprovarOrcamentoUseCase);
    expect(useCase).toBeDefined();
  });

  it("should export OsCriadaPublisher", () => {
    const publisher = module.get(OsCriadaPublisher);
    expect(publisher).toBeDefined();
  });
});
