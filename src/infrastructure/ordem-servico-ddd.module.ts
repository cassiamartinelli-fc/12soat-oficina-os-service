import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// Entities ORM
import { ItemOrdemServico as ItemOrdemServicoOrmEntity } from "./persistence/entities/item-ordem-servico.entity";
import { OrdemServico as OrdemServicoOrmEntity } from "./persistence/entities/ordem-servico.entity";
import { PecaOrdemServico as PecaOrdemServicoOrmEntity } from "./persistence/entities/peca-ordem-servico.entity";

// Repositories
import { OrdemServicoRepositoryImpl } from "./persistence/repositories/ordem-servico.repository.impl";

// Mappers
import { OrdemServicoResponseMapper } from "../application/mappers/ordem-servico-response.mapper";
import { OrdemServicoEmAndamentoMapper } from "../application/mappers/ordem-servico-em-andamento.mapper";
import { ItemPecaMapper } from "./persistence/mappers/item-peca.mapper";
import { ItemServicoMapper } from "./persistence/mappers/item-servico.mapper";
import { OrdemServicoMapper } from "./persistence/mappers/ordem-servico.mapper";

// Use Cases
import {
  AprovarOrcamentoUseCase,
  BuscarOrdemServicoUseCase,
  ExcluirOrdemServicoUseCase,
} from "../application/use-cases/ordem-servico";
import { CriarOrdemServicoUseCase } from "../application/use-cases/ordem-servico/criar-ordem-servico.use-case";
import { AtualizarStatusOrdemServicoUseCase } from "../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case";
import { ListarOrdensEmAndamentoUseCase } from "../application/use-cases/ordem-servico/listar-ordens-em-andamento.use-case";

// Strategies
import { OrdemServicoQueryFactory } from "../application/strategies/ordem-servico-query.factory";

// Controllers
import { OrdemServicoController } from "../presentation/controllers/ordem-servico.controller";

// Tokens
import { ORDEM_SERVICO_REPOSITORY_TOKEN } from "./ddd.module";

// Módulos DDD necessários
import { PecaDddModule } from "./peca-ddd.module";
import { ServicoDddModule } from "./servico-ddd.module";
import { EventBusModule } from "../events/event-bus.module";

// Services
import { MetricsService } from "../shared/services/metrics.service";

// Events
import { OsCriadaPublisher } from "../events/publishers/os-criada.publisher";
import { OrcamentoAprovadoHandler } from "../events/handlers/orcamento-aprovado.handler";
import { OrcamentoCanceladoHandler } from "../events/handlers/orcamento-cancelado.handler";
import { ExecucaoIniciadaHandler } from "../events/handlers/execucao-iniciada.handler";
import { ExecucaoFinalizadaHandler } from "../events/handlers/execucao-finalizada.handler";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdemServicoOrmEntity,
      ItemOrdemServicoOrmEntity,
      PecaOrdemServicoOrmEntity,
    ]),
    ServicoDddModule,
    PecaDddModule,
    EventBusModule,
  ],
  providers: [
    // Services
    MetricsService,

    // Mappers
    OrdemServicoMapper,
    ItemServicoMapper,
    ItemPecaMapper,
    OrdemServicoResponseMapper,
    OrdemServicoEmAndamentoMapper,

    // Repositories
    {
      provide: ORDEM_SERVICO_REPOSITORY_TOKEN,
      useClass: OrdemServicoRepositoryImpl,
    },

    // Use Cases
    CriarOrdemServicoUseCase,
    BuscarOrdemServicoUseCase,
    AtualizarStatusOrdemServicoUseCase,
    ExcluirOrdemServicoUseCase,
    AprovarOrcamentoUseCase,
    ListarOrdensEmAndamentoUseCase,

    // Strategies
    OrdemServicoQueryFactory,

    // Events
    OsCriadaPublisher,
    OrcamentoAprovadoHandler,
    OrcamentoCanceladoHandler,
    ExecucaoIniciadaHandler,
    ExecucaoFinalizadaHandler,
  ],
  controllers: [OrdemServicoController],
  exports: [
    ORDEM_SERVICO_REPOSITORY_TOKEN,
    CriarOrdemServicoUseCase,
    BuscarOrdemServicoUseCase,
    AtualizarStatusOrdemServicoUseCase,
    ExcluirOrdemServicoUseCase,
    AprovarOrcamentoUseCase,
    OsCriadaPublisher,
  ],
})
export class OrdemServicoDddModule {}
