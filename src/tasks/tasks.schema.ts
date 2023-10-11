export const TasksPost = {
  schema: {
    type: 'object',
    properties: {
      title: { example: '"null"' },
      description: { example: '"null"' },
    },
  },
};

export const TasksPostStatus = {
  schema: {
    type: 'object',
    properties: {
      status: { example: '"null"' },
    },
  },
};
