
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../../docs/swagger';

export const swaggerSetup = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};