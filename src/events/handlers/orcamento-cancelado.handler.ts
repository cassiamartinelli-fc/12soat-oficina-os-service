import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { AtualizarStatusOrdemServicoUseCase } from '../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case';
import { StatusOrdemServico } from '../../domain/value-objects/status-ordem-servico.vo';
import { OrcamentoCanceladoEvent } from '../events.types';

@Injectable()
export class OrcamentoCanceladoHandler implements OnModuleInit {
  private readonly logger = new Logger(OrcamentoCanceladoHandler.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly atualizarStatus: AtualizarStatusOrdemServicoUseCase,
  ) {}

  onModuleInit() {
    this.eventBus.registerHandler('ORCAMENTO_CANCELADO', (event) =>
      this.handle(event as OrcamentoCanceladoEvent),
    );
  }

  async handle(event: OrcamentoCanceladoEvent) {
    const { osId } = event.payload;
    this.logger.log(`OrcamentoCancelado recebido para OS ${osId}`);

    try {
      await this.atualizarStatus.execute({
        ordemServicoId: osId,
        novoStatus: StatusOrdemServico.CANCELADA,
      });
      this.logger.log(`OS ${osId} atualizada para CANCELADA`);
    } catch (err) {
      this.logger.error(`Erro ao atualizar OS ${osId}: ${err.message}`);
    }
  }
}
