import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import { SingleElimDetails } from "./entities/singleElimDetails.entity";
import { SingleElimMember } from "./entities/singleElimMember.entity";
import { TournamentService } from "./tournaments.service";
import { MemberVariants } from "./types/memberTables.enum";

@Injectable()
export class SingleEliminationService {
  constructor(
    @InjectRepository(SingleElimMember)
    private singleElimRepository: Repository<SingleElimMember>,
    @InjectRepository(SingleElimDetails)
    private detailsRepository: Repository<SingleElimDetails>,
    private tournamentService: TournamentService,
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
  private getTournSize(memberSize: number) {
    if (memberSize <= 1)
      throw new HttpException(
        "Tournament must have at least 2 members",
        HttpStatus.BAD_REQUEST,
      );
    let tournSize = 2;
    while (tournSize < memberSize) {
      tournSize = tournSize * 2;
    }
    return tournSize;
  }
  @Transactional({ propagation: Propagation.SUPPORTS })
  async createDetails(tournId: number) {
    const detail = this.detailsRepository.create({ tournId });
    await this.detailsRepository.save(detail);
  }
  @Transactional()
  async initialize(tournId: number) {
    const [details, tournament] = await Promise.all([
      this.detailsRepository.findOne({ tournId }),
      this.tournamentService.getTournamentWithMembers({
        relationString: MemberVariants.singleElim,
        tournId,
      }),
    ]);
    const members = tournament.singleElimMembers;
    if (tournament.currentRound)
      throw new HttpException(
        "Cannot initialize a tournament which already began",
        HttpStatus.BAD_REQUEST,
      );
    details.tournSize = this.getTournSize(members.length);

    //TODO: await this at an appropriate time
    const detailsPromise = this.detailsRepository.save(details);

    const round = 1;
    //TODO: await this at an appropriate time
    const roundUpdatePromise = this.tournamentService.incrementTournamentRound(
      tournId,
    );

    //TODO: provide an option in SingleElimDetails for deliberate or blind seeding
    //NEXT: assign seeds and matches
  }
}
