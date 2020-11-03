import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableRoundEliminated1604420532698 implements MigrationInterface {
    name = 'nullableRoundEliminated1604420532698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "single_elim_member" ALTER COLUMN "roundEliminated" SET NOT NULL`);
    }

}
