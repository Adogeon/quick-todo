import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('users', {
        id: { type: 'uuid', primaryKey: true, default: new PgLiteral('gen_random_uuid()') },
        username: { type: 'varchar(1000)', notNull: true, unique: true },
        hash: { type: 'boolean', notNull: true },
        create_date: {
            type: 'timestamp', notNull: true, default: pgm.func('current_timestamp')
        },
        update_date: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('users')
}
