// src/types/express-request.interface.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    id: string; // Certifique-se de que userId é tratado como uma string
  };
}
