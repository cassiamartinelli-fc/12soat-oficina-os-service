import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { AtualizarStatusOrdemServicoUseCase } from '../../application/use-cases/ordem-servico/atualizar-status-ordem-servico.use-case';
import { StatusOrdemServico } from '../../domain/value-objects/status-ordem-servico.vo';
import { OrcamentoAprovadoEvent } from '../events.types';

@Injectable()
export class OrcamentoAprovadoHandler implements OnModuleInit {
  private readonly logger = new Logger(OrcamentoAprovadoHandler.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly atualizarStatus: AtualizarStatusOrdemServicoUseCase,
  ) {}

  onModuleInit() {
    this.eventBus.registerHandler('ORCAMENTO_APROVADO', (event) =>
      this.handle(event as OrcamentoAprovadoEvent),
    );
  }

  async handle(event: OrcamentoAprovadoEvent) {
    const { osId } = event.payload;
    this.logger.log(`OrcamentoAprovado recebido para OS ${osId}`);

    try {
      await this.atualizarStatus.execute({
        ordemServicoId: osId,
        novoStatus: StatusOrdemServico.PAGAMENTO_APROVADO,
      });
      this.logger.log(`OS ${osId} atualizada para PAGAMENTO_APROVADO`);
    } catch (err) {
      this.logger.error(`Erro ao atualizar OS ${osId}: ${err.message}`);
    }
  }
}
