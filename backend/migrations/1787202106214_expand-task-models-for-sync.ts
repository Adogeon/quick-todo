import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('tasks', {
        client_id: { type: 'uuid' },
        version: { type: 'integer', default: 1 },
        synced: { type: 'boolean', default: false }
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumns('tasks', ['client_id', 'version', 'synced'])
}
