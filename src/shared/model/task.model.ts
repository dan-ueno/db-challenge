import { $Enums, Task } from '@prisma/client';

export type TaskType = keyof typeof $Enums.TaskEnum;
export const TaskType = { ...$Enums.TaskEnum };

export interface TaskModel extends Task {
  type: TaskType;
}
