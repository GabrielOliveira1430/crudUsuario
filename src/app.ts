import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import userRoutes from './modules/users/user.routes';
import { swaggerSetup } from './shared/config/swagger';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Swagger centralizado
swaggerSetup(app);

app.use('/api/v1/users', userRoutes);

export default app;