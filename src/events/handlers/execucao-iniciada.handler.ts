import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { AtualizarStatusOrdemServicoUseCase } from '../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case';
import { StatusOrdemServico } from '../../domain/value-objects/status-ordem-servico.vo';
import { ExecucaoIniciadaEvent } from '../events.types';

@Injectable()
export class ExecucaoIniciadaHandler implements OnModuleInit {
  private readonly logger = new Logger(ExecucaoIniciadaHandler.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly atualizarStatus: AtualizarStatusOrdemServicoUseCase,
  ) {}

  onModuleInit() {
    this.eventBus.registerHandler('EXECUCAO_INICIADA', (event) =>
      this.handle(event as ExecucaoIniciadaEvent),
    );
  }

  async handle(event: ExecucaoIniciadaEvent) {
    const { osId } = event.payload;
    this.logger.log(`ExecucaoIniciada recebido para OS ${osId} em ${event.payload.dataInicio}`);

    try {
      await this.atualizarStatus.execute({
        ordemServicoId: osId,
        novoStatus: StatusOrdemServico.EM_EXECUCAO,
      });
      this.logger.log(`OS ${osId} atualizada para EM_EXECUCAO`);
    } catch (err) {
      this.logger.error(`Erro ao atualizar OS ${osId}: ${err.message}`);
    }
  }
}
