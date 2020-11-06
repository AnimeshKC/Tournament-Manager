import {MigrationInterface, QueryRunner} from "typeorm";

export class seedOptions1604697730183 implements MigrationInterface {
    name = 'seedOptions1604697730183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_details" ADD "isBlindSeed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_details" DROP COLUMN "isBlindSeed"`);
    }

}
