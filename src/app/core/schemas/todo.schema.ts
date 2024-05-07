import { JSONSchema } from "@ngx-pwa/local-storage";

export const TodoSchema: JSONSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    completed: { type: 'boolean' },
    createdAt: { type: 'string' },
    timeLeft: { type: 'string' },
    favourite: { type: 'boolean' },
    id: { type: 'string' },
  },
}

export const TodoListSchema: JSONSchema = {
  type: 'array',
  items: TodoSchema,
}
