import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { AtualizarStatusOrdemServicoUseCase } from '../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case';
import { StatusOrdemServico } from '../../domain/value-objects/status-ordem-servico.vo';
import { ExecucaoFinalizadaEvent } from '../events.types';

@Injectable()
export class ExecucaoFinalizadaHandler implements OnModuleInit {
  private readonly logger = new Logger(ExecucaoFinalizadaHandler.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly atualizarStatus: AtualizarStatusOrdemServicoUseCase,
  ) {}

  onModuleInit() {
    this.eventBus.registerHandler('EXECUCAO_FINALIZADA', (event) =>
      this.handle(event as ExecucaoFinalizadaEvent),
    );
  }

  async handle(event: ExecucaoFinalizadaEvent) {
    const { osId } = event.payload;
    this.logger.log(`ExecucaoFinalizada recebido para OS ${osId}`);

    try {
      // FINALIZADA é a transição de EM_EXECUCAO; ENTREGUE virá na Etapa 7 (compensação manual)
      await this.atualizarStatus.execute({
        ordemServicoId: osId,
        novoStatus: StatusOrdemServico.FINALIZADA,
      });
      this.logger.log(`OS ${osId} atualizada para FINALIZADA`);
    } catch (err) {
      this.logger.error(`Erro ao atualizar OS ${osId}: ${err.message}`);
    }
  }
}
