import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class InitSchema1726800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // category
    await queryRunner.createTable(
      new Table({
        name: "category",
        columns: [
          { name: "id", type: "serial", isPrimary: true },
          { name: "name", type: "varchar", isNullable: false },
          { name: "description", type: "varchar", isNullable: true },
        ],
      })
    );
    await queryRunner.createIndex(
      "category",
      new TableIndex({ name: "IDX_category_name_unique", columnNames: ["name"], isUnique: true })
    );

    // product
    await queryRunner.createTable(
      new Table({
        name: "product",
        columns: [
          { name: "id", type: "serial", isPrimary: true },
          { name: "name", type: "varchar", isNullable: false },
          { name: "description", type: "varchar", isNullable: true },
          { name: "price", type: "decimal", isNullable: false },
          { name: "stock", type: "int", isNullable: false },
          { name: "imageUrl", type: "varchar", isNullable: true },
          { name: "categoryId", type: "int", isNullable: true },
        ],
      })
    );
    await queryRunner.createForeignKey(
      "product",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedTableName: "category",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "NO ACTION",
        name: "FK_product_category",
      })
    );

    // user
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          { name: "id", type: "serial", isPrimary: true },
          { name: "email", type: "varchar", isNullable: false },
          { name: "username", type: "varchar", isNullable: false },
          { name: "password", type: "varchar", isNullable: false },
        ],
      })
    );
    await queryRunner.createIndex(
      "user",
      new TableIndex({ name: "IDX_user_email_unique", columnNames: ["email"], isUnique: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order of creation to satisfy FKs
    await queryRunner.dropIndex("user", "IDX_user_email_unique");
    await queryRunner.dropTable("user");

    await queryRunner.dropForeignKey("product", "FK_product_category");
    await queryRunner.dropTable("product");

    await queryRunner.dropIndex("category", "IDX_category_name_unique");
    await queryRunner.dropTable("category");
  }
}
