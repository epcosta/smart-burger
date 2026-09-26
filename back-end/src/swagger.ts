import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Smart Burger",
      version: "1.0.0",
      description: "Documentação da API do Smart Burger",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "user",
        },
      },
    },
  },

  apis: ["./src/router.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
