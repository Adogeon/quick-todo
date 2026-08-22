import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';


export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        INSERT INTO tasks(label) VALUES 
        ('Grocery Shopping'),
        ('Laundry'),
        ('Car wash');
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
