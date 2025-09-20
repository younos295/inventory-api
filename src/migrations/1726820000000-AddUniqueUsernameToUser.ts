import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueUsernameToUser1726820000000 implements MigrationInterface {
  name = 'AddUniqueUsernameToUser1726820000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add a unique constraint/index on user.username if it doesn't exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_indexes
          WHERE schemaname = 'public'
            AND indexname = 'IDX_user_username_unique'
        ) THEN
          CREATE UNIQUE INDEX "IDX_user_username_unique" ON "user" ("username");
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_username_unique";`);
  }
}
