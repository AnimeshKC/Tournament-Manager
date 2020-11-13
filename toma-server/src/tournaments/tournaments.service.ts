import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import { PendingMember } from "./entities/pendingMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { SingleEliminationService } from "./singleElimination.service";
import { TournamentVariants } from "./types/tournamentVariants.enum";
import { variantToServiceMap } from "./types/variantsService.map";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(PendingMember)
    private pendingRepository: Repository<PendingMember>,
    private singleElimService: SingleEliminationService,
  ) {}
  private getServiceByTournType(tournType: TournamentVariants) {
    return this[variantToServiceMap[tournType]];
  }

  //TODO: incorporate a set of options parameter that can be passed to type of tournament service
  @Transactional()
  async createTournament(creationData: {
    userId: number;
    name: string;
    tournamentType: TournamentVariants;
  }): Promise<Tournament> {
    const newTournament = await this.tournamentRepository.save(
      this.tournamentRepository.create(creationData),
    );
    await this.getServiceByTournType(creationData.tournamentType).createDetails(
      newTournament.id,
    );
    return newTournament;
  }
  @Transactional({ propagation: Propagation.SUPPORTS })
  async addParticipantToTournament(participantData: {
    tournamentType: TournamentVariants;
    participantName?: string;
    userId?: number;
    tournId: number;
  }) {
    const { tournamentType, ...singleElimData } = participantData;

    //obtains the corresponding service for a tournament type
    //FUTURE: As more tournaments are added, may need to define an interface for tournService
    return this.getServiceByTournType(tournamentType).addParticipant(
      singleElimData,
    );
  }

  @Transactional()
  async startTournament(tournId: number) {
    /*All pending members not accepted to the tournament should be cleared*/
    const pendingMembers = await this.pendingRepository.find({ tournId });
    await this.pendingRepository.remove(pendingMembers);

    const tournamentType = (await this.tournamentRepository.findOne(tournId))
      .tournamentType;
    return this.getServiceByTournType(tournamentType).initialize(tournId);
  }
}
