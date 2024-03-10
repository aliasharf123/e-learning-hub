import { Module } from '@nestjs/common';
import { RelationalSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SessionService } from './session.service';

@Module({
  imports: [RelationalSessionPersistenceModule],
  providers: [SessionService],
  exports: [SessionService, RelationalSessionPersistenceModule],
})
export class SessionModule {}
