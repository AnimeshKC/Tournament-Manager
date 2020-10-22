import { MigrationInterface, QueryRunner } from "typeorm";

export class cascade1603395055926 implements MigrationInterface {
  name = "cascade1603395055926";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD CONSTRAINT "FK_dfe64d022fa7529fe0738812227" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_0a50651e21a5372a83500876cfe" FOREIGN KEY ("tournId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_4e770972d98d31b84e551231ad6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_4e770972d98d31b84e551231ad6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_0a50651e21a5372a83500876cfe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "FK_dfe64d022fa7529fe0738812227"`,
    );
  }
}
