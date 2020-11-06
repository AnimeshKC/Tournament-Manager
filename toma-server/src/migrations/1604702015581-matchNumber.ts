import {MigrationInterface, QueryRunner} from "typeorm";

export class matchNumber1604702015581 implements MigrationInterface {
    name = 'matchNumber1604702015581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_details" DROP COLUMN "isBlindSeed"`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "matchNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_details" ADD "isBlindSeed" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_details" DROP COLUMN "isBlindSeed"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "matchNumber"`);
        await queryRunner.query(`ALTER TABLE "single_elim_details" ADD "isBlindSeed" boolean NOT NULL DEFAULT true`);
    }

}
