import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import { SingleElimDetails } from "./entities/singleElimDetails.entity";
import { SingleElimMember } from "./entities/singleElimMember.entity";

@Injectable()
export class SingleEliminationService {
  constructor(
    @InjectRepository(SingleElimMember)
    private singleElimRepository: Repository<SingleElimMember>,
    @InjectRepository(SingleElimDetails)
    private singleElimDetails: Repository<SingleElimDetails>,
  ) {}

  @Transactional({ propagation: Propagation.SUPPORTS })
  async addParticipant(participantData: {
    tournId: number;
    participantName?: string;
    userId?: number;
  }) {
    const entry = this.singleElimRepository.create(participantData);
    await this.singleElimRepository.save(entry);

    const { tournId, participantName, userId } = entry;

    return {
      tournId,
      participantName,
      userId,
      type: "Single Elimination",
    };
  }
  @Transactional({ propagation: Propagation.SUPPORTS })
  async createDetails(tournId: number) {
    const detail = this.singleElimDetails.create({ tournId });
    await this.singleElimDetails.save(detail);
  }
  @Transactional({ propagation: Propagation.SUPPORTS })
  async initialize(tournId: number) {
    const details = await this.singleElimDetails.findOne({ tournId });
    // details.tournSize = await this.singleElimRepository.
  }
}
