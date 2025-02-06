import { ConfigService } from '@nestjs/config';

import { Env } from './env';
import { EnvService } from './env.service';

export class InMemoryEnvService extends EnvService {
  constructor(envVariables?: Partial<Env>) {
    const configService = new ConfigService<Env, true>(envVariables as Env);
    super(configService);
  }
}
