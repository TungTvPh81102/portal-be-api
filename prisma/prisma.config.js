"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../src/config/env");
/**
 * Prisma configuration for Prisma v7
 *
 * This file replaces the url property in the datasource block of schema.prisma
 * See: https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
 */
exports.default = {
    // Direct database connection
    adapter: {
        url: env_1.env.DATABASE_URL,
    },
};
//# sourceMappingURL=prisma.config.js.map