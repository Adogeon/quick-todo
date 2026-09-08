import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('tasks', {
        client_id: {
            type: 'uuid',
            notNull: false
        },
        synced: {
            type: 'boolean',
            notNull: true,
            default: false
        },
        version: {
            type: 'integer',
            notNull: true,
            default: 1
        },
        delete_at: {
            type: 'timestamp',
            notNull: false
        }
    })

    pgm.createIndex('tasks', ['user_id', 'synced'])
    pgm.createIndex('tasks', ['user_id', 'is_delete'])
    pgm.createIndex('tasks', ['user_id', 'delete_at'], {
        where: 'is_delete = true',
        name: 'idx_tasks_deleted'
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('tasks', ['user_id', 'synced'])
    pgm.dropIndex('tasks', ['user_id', 'is_delete'])
    pgm.dropIndex('tasks', ['user_id', 'delete_at'], { name: 'idx_tasks_deleted' })
    pgm.dropColumn('tasks', ['client_id', 'synced', 'version', 'delete_at'])
}
