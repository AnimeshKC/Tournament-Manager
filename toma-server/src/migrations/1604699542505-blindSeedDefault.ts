import {MigrationInterface, QueryRunner} from "typeorm";

export class blindSeedDefault1604699542505 implements MigrationInterface {
    name = 'blindSeedDefault1604699542505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_details" DROP COLUMN "isBlindSeed"`);
        await queryRunner.query(`ALTER TABLE "single_elim_details" ADD "isBlindSeed" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_details" DROP COLUMN "isBlindSeed"`);
        await queryRunner.query(`ALTER TABLE "single_elim_details" ADD "isBlindSeed" boolean NOT NULL DEFAULT false`);
    }

}
