import {MigrationInterface, QueryRunner} from "typeorm";

export class matchesTable1604515416021 implements MigrationInterface {
    name = 'matchesTable1604515416021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "tournId" integer NOT NULL, "participantName1" text, "participantName2" text, "userId1" integer, "userId2" integer, "round" integer NOT NULL, CONSTRAINT "CHK_9074e37a43d365d6c7a0281eb6" CHECK ("participantName1" IS NOT NULL OR "userId1" IS NOT NULL OR "participantName2" IS NOT NULL OR "userId2" IS NOT NULL), CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_8ac5f6faa91b3c3c6029da5ddf9" FOREIGN KEY ("tournId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_82068225b67bbc336f67758aa73" FOREIGN KEY ("userId1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_8ea9d5e688c9e8cc563b6031d9f" FOREIGN KEY ("userId2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_8ea9d5e688c9e8cc563b6031d9f"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_82068225b67bbc336f67758aa73"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_8ac5f6faa91b3c3c6029da5ddf9"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "matches"`);
    }

}
