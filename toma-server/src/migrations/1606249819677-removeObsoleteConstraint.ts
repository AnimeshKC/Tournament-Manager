import {MigrationInterface, QueryRunner} from "typeorm";

export class check1606249819677 implements MigrationInterface {
    name = 'check1606249819677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_82068225b67bbc336f67758aa73"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_8ea9d5e688c9e8cc563b6031d9f"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "CHK_9074e37a43d365d6c7a0281eb6"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "participantName1"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "participantName2"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "userId1"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "userId2"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" ADD "userId2" integer`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "userId1" integer`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "participantName2" text`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "participantName1" text`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "CHK_9074e37a43d365d6c7a0281eb6" CHECK ((("participantName1" IS NOT NULL) OR ("userId1" IS NOT NULL) OR ("participantName2" IS NOT NULL) OR ("userId2" IS NOT NULL)))`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_8ea9d5e688c9e8cc563b6031d9f" FOREIGN KEY ("userId2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_82068225b67bbc336f67758aa73" FOREIGN KEY ("userId1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
