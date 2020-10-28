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
  async addParticipant(participantData: {
    tournId: number;
    participantName?: string;
    userId?: number;
  }) {
    try {
      const entry = this.singleElimRepository.create(participantData);
      await this.singleElimRepository.save(entry);

      const { tournId, participantName, userId } = entry;

      return {
        tournId,
        participantName,
        userId,
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
