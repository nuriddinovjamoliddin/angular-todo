import {ITodo} from "./todo.interface";

export type CreateTodoInterface = Omit<ITodo, 'id' | 'createdAt' | 'completed' | 'favourite'>
