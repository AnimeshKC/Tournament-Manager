import {MigrationInterface, QueryRunner} from "typeorm";

export class userTournConstraint1604182005244 implements MigrationInterface {
    name = 'userTournConstraint1604182005244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "Only one user per tournament" UNIQUE ("tournId", "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "Only one user per tournament"`);
    }

}
