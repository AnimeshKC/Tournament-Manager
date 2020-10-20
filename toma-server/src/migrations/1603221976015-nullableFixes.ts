import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableFixes1603221976015 implements MigrationInterface {
    name = 'nullableFixes1603221976015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_4e770972d98d31b84e551231ad6"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_4e770972d98d31b84e551231ad6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_4e770972d98d31b84e551231ad6"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_4e770972d98d31b84e551231ad6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
