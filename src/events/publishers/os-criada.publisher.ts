import { Injectable } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';

@Injectable()
export class OsCriadaPublisher {
  constructor(private readonly eventBus: EventBusService) {}

  async publish(osId: string, clienteId: string, veiculoId: string, valorTotal: number) {
    const billingQueue = process.env.SQS_BILLING_QUEUE_URL;
    const queues = billingQueue ? [billingQueue] : [];
    await this.eventBus.publish(
      'OS_CRIADA',
      osId,
      { osId, clienteId, veiculoId, status: 'recebida', valorTotal },
      'os-service',
      queues,
    );
  }
}
