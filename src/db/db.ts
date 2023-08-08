import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSONFile } from 'lowdb/node';
import { DbData } from 'src/interfaces/db-data-interface';

export const DEFAULT_VALUE: DbData = {
    users: [],
}

export function getDbAdapter() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, '/users.json');
    const adapter = new JSONFile<DbData>(file);
    return adapter;
}
