import { Express } from 'express-serve-static-core';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * Swagger documentation configuration.
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PayStell Backend API',
      version: '1.0.0',
      description: 'API Documentation for paystell backend.',
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/', // Change this to your production server
        description: 'Local server',
      },
    ],
  },
  apis: [
    './src/modules/auth/routes/auth.routes.ts',
    './src/modules/wallet/routes/wallet-verification.routes.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
