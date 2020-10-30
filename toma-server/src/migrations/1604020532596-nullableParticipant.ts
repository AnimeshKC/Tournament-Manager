import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableParticipant1604020532596 implements MigrationInterface {
    name = 'nullableParticipant1604020532596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "Unique Participant name per tournament"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "participantName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "participantName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "Unique Participant name per tournament" UNIQUE ("tournId", "participantName")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "Unique Participant name per tournament"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "participantName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "participantName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "Unique Participant name per tournament" UNIQUE ("participantName", "tournId")`);
    }

}
