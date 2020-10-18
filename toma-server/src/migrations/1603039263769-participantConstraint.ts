import {MigrationInterface, QueryRunner} from "typeorm";

export class participantConstraint1603039263769 implements MigrationInterface {
    name = 'participantConstraint1603039263769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_dfe64d022fa7529fe0738812227"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_03c832d5e36653200a376979090"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_e451fc7a4e8603bb15d12bef273"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" RENAME COLUMN "tournIdId" TO "tournId"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "currentRound"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userIdId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "currentRound" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "Unique Participant name per tournament" UNIQUE ("tournId", "participantName")`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_03c832d5e36653200a376979090" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_dfe64d022fa7529fe0738812227" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_0a50651e21a5372a83500876cfe" FOREIGN KEY ("tournId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_0a50651e21a5372a83500876cfe"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_dfe64d022fa7529fe0738812227"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_03c832d5e36653200a376979090"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "Unique Participant name per tournament"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "currentRound"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userIdId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "currentRound" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" RENAME COLUMN "tournId" TO "tournIdId"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_e451fc7a4e8603bb15d12bef273" FOREIGN KEY ("tournIdId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_03c832d5e36653200a376979090" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_dfe64d022fa7529fe0738812227" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
