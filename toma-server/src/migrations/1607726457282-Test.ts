import {MigrationInterface, QueryRunner} from "typeorm";

export class Test1607726457282 implements MigrationInterface {
    name = 'Test1607726457282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_OnDeleteSetNull"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_4e770972d98d31b84e551231ad6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_4e770972d98d31b84e551231ad6"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_OnDeleteSetNull" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
