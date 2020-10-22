import {MigrationInterface, QueryRunner} from "typeorm";

export class pendingTable1603393606169 implements MigrationInterface {
    name = 'pendingTable1603393606169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pending_member" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "tournId" integer NOT NULL, CONSTRAINT "PK_d9b58d2366f01d746ff84412986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pending_member" ADD CONSTRAINT "FK_4f78267b2f7cd77253aa4d0ba1d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pending_member" ADD CONSTRAINT "FK_80465c66802ca45cf18f6ec1f0a" FOREIGN KEY ("tournId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_member" DROP CONSTRAINT "FK_80465c66802ca45cf18f6ec1f0a"`);
        await queryRunner.query(`ALTER TABLE "pending_member" DROP CONSTRAINT "FK_4f78267b2f7cd77253aa4d0ba1d"`);
        await queryRunner.query(`DROP TABLE "pending_member"`);
    }

}
