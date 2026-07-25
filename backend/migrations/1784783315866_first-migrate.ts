import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('tasks', {
        id: 'id',
        label: { type: 'varchar(1000)', notNull: true },
        isDone: { type: 'boolean', notNull: true, default: false },
        createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> { }
