import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { ReservationModule } from './modules/reservation/reservation.module';

@Module({
  imports: [ClientModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
