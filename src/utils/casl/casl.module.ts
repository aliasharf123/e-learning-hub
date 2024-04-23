import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '.';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
