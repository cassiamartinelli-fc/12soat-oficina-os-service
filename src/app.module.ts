import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteDddModule } from './infrastructure/cliente-ddd.module';
import { VeiculoDddModule } from './infrastructure/veiculo-ddd.module';
import { PecaDddModule } from './infrastructure/peca-ddd.module';
import { ServicoDddModule } from './infrastructure/servico-ddd.module';
import { OrdemServicoDddModule } from './infrastructure/ordem-servico-ddd.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // Apenas para desenvolvimento
      logging: false,
    }),
    ClienteDddModule,
    VeiculoDddModule,
    PecaDddModule,
    ServicoDddModule,
    OrdemServicoDddModule,
  ],
})
export class AppModule {}
