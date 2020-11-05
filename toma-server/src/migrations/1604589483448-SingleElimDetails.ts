import {MigrationInterface, QueryRunner} from "typeorm";

export class SingleElimDetails1604589483448 implements MigrationInterface {
    name = 'SingleElimDetails1604589483448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "single_elim_details" ("id" SERIAL NOT NULL, "tournSize" integer, "tournId" integer NOT NULL, CONSTRAINT "REL_699be33caed62df8b08d6ee8a2" UNIQUE ("tournId"), CONSTRAINT "PK_e68f4da42c7e9024a30999bc281" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "single_elim_details" ADD CONSTRAINT "FK_699be33caed62df8b08d6ee8a24" FOREIGN KEY ("tournId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_details" DROP CONSTRAINT "FK_699be33caed62df8b08d6ee8a24"`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "single_elim_details"`);
    }

}
