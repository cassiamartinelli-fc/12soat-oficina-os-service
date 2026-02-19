import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { ExecucaoIniciadaEvent } from '../events.types';

@Injectable()
export class ExecucaoIniciadaHandler implements OnModuleInit {
  private readonly logger = new Logger(ExecucaoIniciadaHandler.name);

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit() {
    this.eventBus.registerHandler('EXECUCAO_INICIADA', (event) =>
      this.handle(event as ExecucaoIniciadaEvent),
    );
  }

  async handle(event: ExecucaoIniciadaEvent) {
    // OS já está em EM_EXECUCAO (atualizado pelo handler de OrcamentoAprovado)
    // Apenas loga para rastreabilidade
    this.logger.log(
      `ExecucaoIniciada recebido para OS ${event.payload.osId} em ${event.payload.dataInicio}`,
    );
  }
}
