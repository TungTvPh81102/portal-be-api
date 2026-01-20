import { Logger } from 'drizzle-orm/logger';
import { LoggingService } from './logging.service';

export class DbLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    // We log everything except the log insertion itself to avoid infinite loop
    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery.includes('cim_sql_log')) {
      return;
    }

    // Since logQuery doesn't provide duration directly, we just log the query.
    // Drizzle v2 might have more info, but for now we log the text and params.
    LoggingService.logSql(query, params, 0).catch(err => {
      console.error('Error logging SQL query:', err);
    });
  }
}
