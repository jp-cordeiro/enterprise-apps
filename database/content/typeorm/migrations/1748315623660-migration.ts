import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748315623660 implements MigrationInterface {
    name = 'Migration1748315623660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "externalRating" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "externalRating"`);
    }

}
