import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import { Matches } from "./entities/matches.entity";
import { PendingMember } from "./entities/pendingMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { SingleEliminationService } from "./singleElimination.service";
import { TournGenericService } from "./tournGeneric.service";
import { TournamentVariants } from "./types/tournamentVariants.enum";
import { variantToServiceMap } from "./types/variantsService.map";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(PendingMember)
    private pendingRepository: Repository<PendingMember>,
    @InjectRepository(Matches)
    private matchesRepository: Repository<Matches>,
    private singleElimService: SingleEliminationService,
    private tournGenericService: TournGenericService,
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
    /*when starting a tournament, all its pending members are to be cleared,
    as they lose their window for acceptance
    */
    const removePendingMembersPromise = this.removePendingMembers(tournId);

    const getTournamentTypePromise = this.getTournamentType(tournId);
    const [_, tournamentType] = await Promise.all([
      removePendingMembersPromise,
      getTournamentTypePromise,
    ]);
    return this.getServiceByTournType(tournamentType).initialize(tournId);
  }
  private async getTournament(tournId: number) {
    return this.tournGenericService.getTournament(tournId);
  }
  private async getTournamentType(tournId: number) {
    const tournament = await this.getTournament(tournId);
    return tournament.tournamentType;
  }

  private async removePendingMembers(tournId: number) {
    const pendingMembers = await this.pendingRepository.find({ tournId });
    await this.pendingRepository.remove(pendingMembers);
  }
  public async getRemainingTournMembers(
    tournId: number,
    tournamentType: TournamentVariants,
  ) {
    return this.getServiceByTournType(tournamentType).getRemainingTournMembers(
      tournId,
    );
  }

  async assignLoss({
    roundNumber,
    memberId,
    tournamentType,
  }: {
    roundNumber: number;
    memberId: number;
    tournamentType: TournamentVariants;
  }) {
    const member = await this.getServiceByTournType(tournamentType).assignLoss({
      memberId,
      roundNumber,
    });
    return member;
  }
}
