import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import PostgresErrorCode from "src/database/postgresErrorCodes.enum";
import { Repository } from "typeorm";
import { SingleElimMember } from "./entities/singleElimMember.entity";

@Injectable()
export class SingleEliminationService {
  constructor(
    @InjectRepository(SingleElimMember)
    private singleElimRepository: Repository<SingleElimMember>,
  ) {}
  async addParticipantName(tournId: number, participantName: string) {
    try {
      const entry = this.singleElimRepository.create({
        participantName,
        tournId,
      });
      await this.singleElimRepository.save(entry);
      return {
        participantName: entry.participantName,
        tournId: entry.tournId,
        type: "Single Elimination",
      };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
}
