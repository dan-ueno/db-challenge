import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CreateScheduleInputData,
  ScheduleBaseModel,
  ScheduleDatasourceService,
  ScheduleModel,
  UpdateScheduleInputData,
} from 'shared';
import {
  ACCOUNT_UNAUTHORIZED_MESSAGE,
  CheckAccountUseCase,
} from 'src/graphql/task/service/use-case';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleDatasource: ScheduleDatasourceService,
    private readonly checkAccountUseCase: CheckAccountUseCase,
  ) {}

  async findAvailableByAccountId(id: number): Promise<ScheduleModel[]> {
    return this.scheduleDatasource.findAvailableByAccountId(id);
  }

  async findAvailableByAgentId(id: number): Promise<ScheduleModel[]> {
    return this.scheduleDatasource.findAvailableByAgentId(id);
  }

  async create(
    accountId: number,
    input: Omit<CreateScheduleInputData, 'accountId'>,
  ): Promise<ScheduleBaseModel> {
    await this.checkAccountUseCase.exec(accountId);

    return this.scheduleDatasource.create({ ...input, accountId });
  }

  async update(
    accountId: number,
    input: UpdateScheduleInputData & { id: string },
  ): Promise<ScheduleBaseModel> {
    const { id, ...dataToUpdate } = input;
    await this.checkAccountUseCase.exec(accountId);

    const schedule = await this.scheduleDatasource.findById(id);
    if (schedule.accountId !== accountId) {
      throw new UnauthorizedException(ACCOUNT_UNAUTHORIZED_MESSAGE);
    }

    return this.scheduleDatasource.update(id, dataToUpdate);
  }

  async delete(id: string, accountId: number): Promise<void> {
    await this.checkAccountUseCase.exec(accountId);

    const schedule = await this.scheduleDatasource.findById(id);
    if (schedule.accountId !== accountId) {
      throw new UnauthorizedException(ACCOUNT_UNAUTHORIZED_MESSAGE);
    }

    return this.scheduleDatasource.delete(id);
  }
}
