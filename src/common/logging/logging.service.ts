import { db } from '@/db';
import { cimSqlLog } from '@/models/system.model';
import { FastifyRequest, FastifyReply } from 'fastify';

export interface LogData {
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  sqlText?: string;
  sqlParams?: any;
  operation?: string;
  durationMs?: number;
  executedBy?: string;
  userId?: string;
  module?: string;
  ipAddress?: string;
  userAgent?: string;
  payload?: any;
  responseData?: any;
  isError?: boolean;
  message?: string;
}

export class LoggingService {
  /**
   * Log an action to cim_sql_log
   */
  static async log(data: LogData) {
    try {
      await db.insert(cimSqlLog).values({
        requestId: data.requestId,
        method: data.method,
        url: data.url,
        statusCode: data.statusCode,
        sqlText: data.sqlText,
        sqlParams: data.sqlParams,
        operation: data.operation,
        durationMs: data.durationMs,
        executedBy: data.executedBy,
        userId: data.userId,
        module: data.module,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        payload: data.payload,
        responseData: data.responseData,
        isError: data.isError || false,
        message: data.message,
      });
    } catch (error) {
      // Fallback to console if DB logging fails to avoid crashing the app
      console.error('Failed to write log to DB:', error);
    }
  }

  /**
   * Log request/response info from Fastify
   */
  static async logRequest(request: FastifyRequest, reply: FastifyReply, durationMs: number) {
    const userId = (request.user as any)?.id?.toString();
    const executedBy = (request.user as any)?.username || (request.user as any)?.email;

    // Capture payload (body, query, params)
    const payload = {
      body: request.body,
      query: request.query,
      params: request.params,
    };

    await this.log({
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      durationMs,
      userId,
      executedBy,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      payload,
      operation: 'API_REQUEST',
    });
  }

  /**
   * Log SQL query info
   */
  static async logSql(sql: string, params: any[], durationMs: number) {
    await this.log({
      sqlText: sql,
      sqlParams: params,
      durationMs,
      operation: 'SQL_QUERY',
    });
  }

  /**
   * Log error info
   */
  static async logError(error: any, request?: FastifyRequest) {
    await this.log({
      requestId: request?.id,
      method: request?.method,
      url: request?.url,
      isError: true,
      message: error instanceof Error ? error.stack || error.message : JSON.stringify(error),
      ipAddress: request?.ip,
      userAgent: request?.headers['user-agent'],
      operation: 'ERROR',
    });
  }
}
