import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import bcrypt from 'bcrypt';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
        console.log("Skepping dev seed data (not in development)")
        return
    }

    console.log(`Seeding development data ...`)

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds)

    const users = await pgm.db.query(`
            INSERT INTO users (username, hash)
            VALUES
                ('dev_user_1', $1),
                ('dev_user_2', $2)
            RETURNING id, username
        `, [hashedPassword, hashedPassword])
    const user1 = users.rows[0]
    const user2 = users.rows[1]
    await pgm.db.query(`
        INSERT INTO tasks (label, user_id, is_done, is_delete) 
        VALUES 
            ('Buy groceries', $1, false, false),
            ('Walk the dog', $1, false, false),
            ('Write documentation', $1, false, false),
            ('Review pull requests', $1, true, false),
            ('Deploy to production', $1, false, false),
            ('Fix login bug', $1, false, false)
        `, [user1.id])

    await pgm.db.query(`
        INSERT INTO tasks (label, user_id, is_done, is_delete) 
        VALUES 
            ('Design homepage', $1, true, false),
            ('Update portfolio', $1, false, false),
            ('Response to emails', $1, true, false),
            ('Schedule interview', $1, false, false),
            ('Write blog post', $1, false, false),
            ('Review analytics', $1, false, false)
        `, [user2.id])

    await pgm.db.query(`
        INSERT INTO tasks (label, user_id, is_done, is_delete)
        VALUES
            ('Old task 1', $1, false, true),
            ('Old task 2', $1, true, true),
            ('Old task 3', $2, false, true)
        `, [user1.id, user2.id])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
        console.log("Skipping dev seed rollback (not in development)")
        return
    }

    console.log("Rolling back development seed data")

    await pgm.db.query(`
        DELETE FROM tasks WHERE user_id IN (SELECT id FROM users WHERE username like 'dev_user_%')
        `)
    await pgm.db.query(`
        DELETE FROM users WHERE username LIKE 'dev_user_%'
        `)

    console.log(`Development seed data rolled back`)
}
