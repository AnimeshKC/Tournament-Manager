import {MigrationInterface, QueryRunner} from "typeorm";

export class roundNumber1602946273458 implements MigrationInterface {
    name = 'roundNumber1602946273458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" ADD "currentRound" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "currentRound"`);
    }

}
