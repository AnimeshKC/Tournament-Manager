import {MigrationInterface, QueryRunner} from "typeorm";

export class foreignRelationships1603072217040 implements MigrationInterface {
    name = 'foreignRelationships1603072217040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_03c832d5e36653200a376979090"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TYPE "public"."tournament_tournamenttype_enum" RENAME TO "tournament_tournamenttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "tournament_tournamenttype_enum" AS ENUM('Single Elimination')`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" TYPE "tournament_tournamenttype_enum" USING "tournamentType"::"text"::"tournament_tournamenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT 'Single Elimination'`);
        await queryRunner.query(`DROP TYPE "tournament_tournamenttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT 'Single Elimination'`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_4e770972d98d31b84e551231ad6"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."tournament_tournamenttype_enum" RENAME TO "tournament_tournamenttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "tournament_tournamenttype_enum" AS ENUM('Single Elimination')`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" TYPE "tournament_tournamenttype_enum" USING "tournamentType"::"text"::"tournament_tournamenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT 'Single Elimination'`);
        await queryRunner.query(`DROP TYPE "tournament_tournamenttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT 'Single Elimination'`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_4e770972d98d31b84e551231ad6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" DROP CONSTRAINT "FK_4e770972d98d31b84e551231ad6"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "tournament_tournamenttype_enum_old" AS ENUM('0')`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" TYPE "tournament_tournamenttype_enum_old" USING "tournamentType"::"text"::"tournament_tournamenttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT 'Single Elimination'`);
        await queryRunner.query(`DROP TYPE "tournament_tournamenttype_enum"`);
        await queryRunner.query(`ALTER TYPE "tournament_tournamenttype_enum_old" RENAME TO  "tournament_tournamenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ADD CONSTRAINT "FK_4e770972d98d31b84e551231ad6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "tournament_tournamenttype_enum_old" AS ENUM('0')`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" TYPE "tournament_tournamenttype_enum_old" USING "tournamentType"::"text"::"tournament_tournamenttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "tournamentType" SET DEFAULT 'Single Elimination'`);
        await queryRunner.query(`DROP TYPE "tournament_tournamenttype_enum"`);
        await queryRunner.query(`ALTER TYPE "tournament_tournamenttype_enum_old" RENAME TO  "tournament_tournamenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userIdId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_03c832d5e36653200a376979090" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
