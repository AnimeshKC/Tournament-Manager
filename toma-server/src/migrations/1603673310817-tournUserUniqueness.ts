import {MigrationInterface, QueryRunner} from "typeorm";

export class tournUserUniqueness1603673310817 implements MigrationInterface {
    name = 'tournUserUniqueness1603673310817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_member" ADD CONSTRAINT "No duplicate member per tourn-user pair" UNIQUE ("tournId", "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_member" DROP CONSTRAINT "No duplicate member per tourn-user pair"`);
    }

}
