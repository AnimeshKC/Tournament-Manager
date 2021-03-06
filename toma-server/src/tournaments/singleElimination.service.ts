import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createQueryBuilder, Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import { validateDefined } from "../utilFunctions/validateDefined.util";
import { singleEliminationMatches } from "./entities/singleElimMatches.entity";
import { SingleElimDetails } from "./entities/singleElimDetails.entity";
import { SingleElimMember } from "./entities/singleElimMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { TournGenericService } from "./tournGeneric.service";
import { validate } from "class-validator";

//Most Likely extract this to file in the future
//Uses the Fiser Yates Algorithm
function shuffleArray<T>(array: T[]): T[] {
  if (array.length <= 1) return array;
  for (let i = array.length - 1; i >= 1; i--) {
    const swapIndex = Math.floor((i + 1) * Math.random()); //a random index between 0 and i
    [array[i], array[swapIndex]] = [array[swapIndex], array[i]];
  }
  return array;
}

@Injectable()
export class SingleEliminationService {
  constructor(
    @InjectRepository(SingleElimMember)
    private readonly singleElimMemberRepository: Repository<SingleElimMember>,
    @InjectRepository(SingleElimDetails)
    private readonly detailsRepository: Repository<SingleElimDetails>,
    @InjectRepository(singleEliminationMatches)
    private readonly singleEliminationMatchesRepository: Repository<
      singleEliminationMatches
    >,
    private tournGenericService: TournGenericService,
  ) {}

  @Transactional({ propagation: Propagation.SUPPORTS })
  async addParticipant(participantData: {
    tournId: number;
    participantName?: string;
    userId?: number;
  }) {
    const entry = this.singleElimMemberRepository.create(participantData);
    await this.singleElimMemberRepository.save(entry);

    const { tournId, participantName, userId } = entry;

    return {
      tournId,
      participantName,
      userId,
      type: "Single Elimination",
    };
  }
  //returns the smallest power of 2 >= member size
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
  private getMatchNumber({
    seedValue,
    round,
    tournSize,
  }: {
    seedValue: number;
    round: number;
    tournSize: number;
  }) {
    /*
  Second-half seedValues have the same matchNumber as their first-half counterparts
  ex. in a 16 person tournament:
    (<matchNumber>, [<lowerSeed>,<higherSeed>]) ->
     [(1, [1, 16]), (2, [2, 15], ... (8, [8, 9]))
  */
    const firstRoundNumber =
      seedValue <= tournSize / 2 ? seedValue : tournSize - seedValue + 1;

    //e.g. winner of the 8th match of round 1 will be in the 4th match of round 2 and the 2nd match of round 3
    const matchNumber = Math.ceil(firstRoundNumber / Math.pow(2, round - 1));

    return matchNumber;
  }
  private getMatchesForRound({
    memberList,
    round,
    tournSize,
  }: {
    memberList: SingleElimMember[];
    round: number;
    tournSize: number;
  }) {
    const rankMap: Record<number, singleEliminationMatches> = {};

    for (const member of memberList) {
      const matchNumber = this.getMatchNumber({
        seedValue: member.seedValue,
        tournSize,
        round,
      });
      if (matchNumber in rankMap) {
        rankMap[matchNumber] = this.getMatchObjSecond(
          rankMap[matchNumber],
          member,
        );
      } else
        rankMap[matchNumber] = this.getMatchObjFirst({
          member,
          round,
          matchNumber,
        });
    }
    const matches = Object.values(rankMap);

    //for ease of frontend displaying
    matches.sort((a, b) => a.matchNumber - b.matchNumber);

    return matches;
  }
  private async assignBlindSeeds(memberList: SingleElimMember[]) {
    shuffleArray(memberList);
    memberList.forEach((member, i) => (member.seedValue = i + 1));
    await this.singleElimMemberRepository.save(memberList);
  }

  //returns a match object with first user and null
  private getMatchObjFirst({
    member,
    round,
    matchNumber,
  }: {
    member: SingleElimMember;
    round: number;
    matchNumber: number;
  }): singleEliminationMatches {
    return this.singleEliminationMatchesRepository.create({
      tournId: member.tournId,
      member1Id: member.id,
      round,
      matchNumber,
    });
  }
  public async getTournamentWithRemainingMembers(tournId: number) {
    // const tournament = await this.tournamentRepository.findOne({id: tournId})
    const tournament = await createQueryBuilder<Tournament>(
      Tournament,
      "tournament",
    )
      .leftJoinAndSelect("tournament.singleElimMembers", "singleElimMembers")
      .where("tournament.id = :id", { id: tournId })
      .andWhere("singleElimMembers.roundEliminated IS NULL")
      .getOne();
    validateDefined(tournament, "corresponding tournament not defined");
    return tournament;
  }
  private async getDetails(tournId: number) {
    const details = this.detailsRepository.findOne({ tournId });
    validateDefined(details, "corresponding details not defined");
    return details;
  }
  private async getDetailsAndTournMembers(tournId: number) {
    return Promise.all([
      this.getDetails(tournId),
      this.getTournamentWithRemainingMembers(tournId),
    ]);
  }
  //adds the second user to a match object that has the first user filled
  private getMatchObjSecond(
    firstMatchObj: singleEliminationMatches,
    newMember: SingleElimMember,
  ) {
    return this.singleEliminationMatchesRepository.create({
      ...firstMatchObj,
      member2Id: newMember.id,
    });
  }
  @Transactional({ propagation: Propagation.SUPPORTS })
  async createDetails(tournId: number) {
    const detail = this.detailsRepository.create({ tournId });
    await this.detailsRepository.save(detail);
  }

  private validatePendingTournament(round: number) {
    if (round)
      throw new HttpException(
        "Cannot initialize a tournament which already began",
        HttpStatus.BAD_REQUEST,
      );
  }
  private assignMatches(
    members: SingleElimMember[],
    details: SingleElimDetails,
    round = 1,
  ) {
    const matches = this.getMatchesForRound({
      memberList: members,
      round,
      tournSize: details.tournSize,
    });
    return matches;
  }
  private async seedMembers(
    details: SingleElimDetails,
    members: SingleElimMember[],
  ) {
    if (details.isBlindSeed) await this.assignBlindSeeds(members);
    //TODO: #1 Add Custom Seeding option
    else throw new Error("This logic has not yet been implemented");
  }

  private validateStartedTournament(round: number) {
    if (!round)
      throw new HttpException(
        "Tournament Must have begun",
        HttpStatus.BAD_REQUEST,
      );
  }
  private async updateRound(tournId: number) {
    return await this.tournGenericService.incrementTournamentRound(tournId);
  }
  private async writeMatchesForRound(
    members: SingleElimMember[],
    details: SingleElimDetails,
    round = 1,
  ) {
    //all members will have the same tournId
    const tournId = members[0].tournId;

    // const roundUpdatePromise = this.tournGenericService.incrementTournamentRound(
    //   tournId,
    // );
    const matches = this.assignMatches(members, details, round);
    await this.singleEliminationMatchesRepository.save(matches);
    return matches;
  }
  //TODO: Need to add in member validations
  //TODO:add a custom query for details and tournament that also filters out eliminated members
  @Transactional()
  async serviceNextRound(tournId: number) {
    const [details, tournament] = await this.getDetailsAndTournMembers(tournId);

    /* need to ensure tournament round is greater than 0;
    otherwise, tournSize will be null, and initialize should have been called instead */
    this.validateStartedTournament(tournament.currentRound);

    //Need to ensure that the next round is processed only if all the matches have ended
    /*In the case of a tournament being forced to move onto another round, another method
    will take care of eliminating ongoing matches*/
    await this.validateRoundComplete({
      tournId,
      round: tournament.currentRound,
    });

    const members = tournament.singleElimMembers;
    const nextRound = tournament.currentRound + 1;
    const [_, matches] = await Promise.all([
      this.updateRound(tournId),
      this.writeMatchesForRound(members, details, nextRound),
    ]);

    return matches;
  }
  private validateOnlyWinnerRemains(remainingMembers: SingleElimMember[]) {
    if (remainingMembers.length > 1) {
      throw new HttpException(
        "Cannot declare a winner as more than one member remains",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async declareWinner(tournId: number) {
    const tournament = await this.getTournamentWithRemainingMembers(tournId);
    const remainingMembers = tournament.singleElimMembers;
    this.validateOnlyWinnerRemains(remainingMembers);
    const winner = remainingMembers[0];

    return { isWinnerFound: true, ...winner };
  }
  private async validateRoundComplete({
    tournId,
    round,
  }: {
    tournId: number;
    round: number;
  }) {
    const matches = await this.singleEliminationMatchesRepository.find({
      tournId,
      round,
    });
    for (const match of matches) {
      const member1Id = match.member1Id;
      const member2Id = match.member2Id;

      //if there's only one member to a match (a bye), it's already complete
      if (!member1Id || !member2Id) {
        continue;
      }
      const [member1, member2] = await Promise.all([
        this.singleElimMemberRepository.findOne(member1Id),
        this.singleElimMemberRepository.findOne(member2Id),
      ]);

      if (!member1.roundEliminated && !member2.roundEliminated) {
        throw new HttpException(
          "Cannot advance Round when there is an unfinished match",
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  @Transactional()
  async initialize(tournId: number) {
    const [details, tournament] = await this.getDetailsAndTournMembers(tournId);

    /* Need to ensure tournament hasn't already started; otherwise, 
    serviceNextRound should have been called instead*/
    this.validatePendingTournament(tournament.currentRound);

    const members = tournament.singleElimMembers;
    details.tournSize = this.getTournSize(members.length);
    await this.seedMembers(details, members);

    const [_, __, matches] = await Promise.all([
      this.detailsRepository.save(details),
      this.updateRound(tournId),
      this.writeMatchesForRound(members, details, 1),
    ]);
    return matches;
  }

  async getMemberById(memberId: number) {
    const member = await this.singleElimMemberRepository.findOne(memberId);
    validateDefined(member, "Cannot find specified member");
    return member;
  }
  private async updateMemberRoundEliminated(
    member: SingleElimMember,
    roundEliminated: number,
  ) {
    member.roundEliminated = roundEliminated;
    await this.singleElimMemberRepository.save(member);
  }
  async assignLoss({
    memberId,
    roundNumber,
  }: {
    memberId: number;
    roundNumber: number;
  }) {
    const member = await this.getMemberById(memberId);
    if (!member.roundEliminated) {
      await this.updateMemberRoundEliminated(member, roundNumber);
      return member;
    } else {
      throw new HttpException(
        "This Member has already lost",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
