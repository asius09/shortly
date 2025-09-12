const { z } = require('zod');
const { Status } = require('../constant');

const ResponseSchema = z.object({
  data: z.any().optional(),
  message: z.string().optional(),
  status: z.enum(Object.values(Status)).optional(),
  statusCode: z.number().optional(),
  error: z.union([z.string(), z.array(z.string())]).optional(),
});

module.exports = ResponseSchema;
