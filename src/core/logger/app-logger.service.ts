import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  //TODO: Change to better logger, like winston. Logger just for demonstration
}
