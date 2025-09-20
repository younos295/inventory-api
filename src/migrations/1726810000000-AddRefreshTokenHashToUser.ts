import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRefreshTokenHashToUser1726810000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "refreshTokenHash",
        type: "varchar",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user", "refreshTokenHash");
  }
}
