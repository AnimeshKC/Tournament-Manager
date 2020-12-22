import {MigrationInterface, QueryRunner} from "typeorm";

export class singleElimMatches1608649652997 implements MigrationInterface {
    name = 'singleElimMatches1608649652997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "single_elimination_matches" ("id" SERIAL NOT NULL, "tournId" integer NOT NULL, "member1Id" integer, "member2Id" integer, "round" integer NOT NULL, "matchNumber" integer NOT NULL, CONSTRAINT "PK_bdc2af39afe837b31bcd722c1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "single_elimination_matches" ADD CONSTRAINT "FK_0e0803bbfdb9c8fa62ca10207e8" FOREIGN KEY ("tournId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "single_elimination_matches" ADD CONSTRAINT "FK_15b920e458040c52052c935a74e" FOREIGN KEY ("member1Id") REFERENCES "single_elim_member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "single_elimination_matches" ADD CONSTRAINT "FK_b2e05c0b9a5ee239600f85bf2b9" FOREIGN KEY ("member2Id") REFERENCES "single_elim_member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elimination_matches" DROP CONSTRAINT "FK_b2e05c0b9a5ee239600f85bf2b9"`);
        await queryRunner.query(`ALTER TABLE "single_elimination_matches" DROP CONSTRAINT "FK_15b920e458040c52052c935a74e"`);
        await queryRunner.query(`ALTER TABLE "single_elimination_matches" DROP CONSTRAINT "FK_0e0803bbfdb9c8fa62ca10207e8"`);
        await queryRunner.query(`DROP TABLE "single_elimination_matches"`);
    }

}
