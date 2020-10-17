import {MigrationInterface, QueryRunner} from "typeorm";

export class singleElimTable1602948232974 implements MigrationInterface {
    name = 'singleElimTable1602948232974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "single_elim_member" ("id" SERIAL NOT NULL, "participantName" text NOT NULL, "roundEliminated" integer NOT NULL DEFAULT 0, "seedValue" integer NOT NULL DEFAULT 0, "tournIdId" integer NOT NULL, "userId" integer, CONSTRAINT "CHK_b16e8ee9c8ca6b051b9e8602b5" CHECK ("participantName" IS NOT NULL OR "userId" IS NOT NULL), CONSTRAINT "PK_27eb816cf7ddcdf8a1fca5a8345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "currentRound"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "currentRound" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_e451fc7a4e8603bb15d12bef273" FOREIGN KEY ("tournIdId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_4e770972d98d31b84e551231ad6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_4e770972d98d31b84e551231ad6"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_e451fc7a4e8603bb15d12bef273"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "currentRound"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "currentRound" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`DROP TABLE "single_elim_member"`);
    }

}
