import {MigrationInterface, QueryRunner} from "typeorm";

export class tournamentTable1602432807848 implements MigrationInterface {
    name = 'tournamentTable1602432807848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "tournament_tournamenttype_enum" AS ENUM('0')`);
        await queryRunner.query(`CREATE TYPE "tournament_tournamentstatus_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "tournament_tournamentaccess_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "tournament" ("id" SERIAL NOT NULL, "name" text NOT NULL, "tournamentType" "tournament_tournamenttype_enum" NOT NULL DEFAULT '0', "tournamentStatus" "tournament_tournamentstatus_enum" NOT NULL DEFAULT '0', "tournamentAccess" "tournament_tournamentaccess_enum" NOT NULL DEFAULT '0', "joinable" boolean NOT NULL DEFAULT true, "userIdId" integer, CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_03c832d5e36653200a376979090" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_03c832d5e36653200a376979090"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`DROP TABLE "tournament"`);
        await queryRunner.query(`DROP TYPE "tournament_tournamentaccess_enum"`);
        await queryRunner.query(`DROP TYPE "tournament_tournamentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "tournament_tournamenttype_enum"`);
    }

}
