import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: {
    kind: "local",
    path: "prisma/schema.prisma",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
