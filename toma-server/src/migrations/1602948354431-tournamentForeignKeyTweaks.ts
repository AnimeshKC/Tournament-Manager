import {MigrationInterface, QueryRunner} from "typeorm";

export class tournamentForeignKeyTweaks1602948354431 implements MigrationInterface {
    name = 'tournamentForeignKeyTweaks1602948354431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_03c832d5e36653200a376979090"`);
        await queryRunner.query(`ALTER TABLE "tournament" RENAME COLUMN "userIdId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "currentRound"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userIdId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "currentRound" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_03c832d5e36653200a376979090" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_dfe64d022fa7529fe0738812227" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_dfe64d022fa7529fe0738812227"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_03c832d5e36653200a376979090"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "currentRound"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "currentRound" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" RENAME COLUMN "userId" TO "userIdId"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_03c832d5e36653200a376979090" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
