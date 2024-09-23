import { $Enums, Task } from '@prisma/client';
import { AccountBaseModel } from './account.model';

export type TaskType = keyof typeof $Enums.TaskEnum;
export const TaskType = { ...$Enums.TaskEnum };

export interface TaskBaseModel extends Task {
  type: TaskType;
}

export interface TaskModel extends TaskBaseModel {
  account: AccountBaseModel;
}