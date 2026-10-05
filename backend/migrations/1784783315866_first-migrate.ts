import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createExtension('uuid-ossp', { ifNotExists: true });
    pgm.createTable('users', {
        id: { type: 'uuid', primaryKey: true, default: new PgLiteral('gen_random_uuid()') },
        username: { type: 'varchar(1000)', notNull: true, unique: true },
        hash: { type: 'varchar(1000)', notNull: true },
        create_date: {
            type: 'timestamp', notNull: true, default: pgm.func('current_timestamp')
        },
        update_date: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    })
    pgm.createTable('tasks', {
        id: { type: 'uuid', primaryKey: true, default: new PgLiteral('gen_random_uuid()') },
        label: { type: 'varchar(1000)', notNull: true },
        user_id: { type: 'uuid', references: '"users"', notNull: true, onDelete: 'CASCADE' },
        is_done: { type: 'boolean', notNull: true, default: false },
        is_delete: { type: 'boolean', notNull: true, default: false },
        create_date: {
            type: 'timestamp', notNull: true, default: pgm.func('current_timestamp')
        },
        update_date: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    })
    pgm.createIndex('tasks', 'user_id')
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('tasks')
    pgm.dropTable('users')
    pgm.dropExtension('uuid-ossp', { ifExists: true })
}
