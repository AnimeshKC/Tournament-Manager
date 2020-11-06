import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import { Matches } from "./entities/matches.entity";
import { SingleElimDetails } from "./entities/singleElimDetails.entity";
import { SingleElimMember } from "./entities/singleElimMember.entity";
import { TournamentService } from "./tournaments.service";
import { MemberVariants } from "./types/memberTables.enum";

//Most Likely extract this to file in the future

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
    private readonly singleElimRepository: Repository<SingleElimMember>,
    @InjectRepository(SingleElimDetails)
    private readonly detailsRepository: Repository<SingleElimDetails>,
    @InjectRepository(Matches)
    private readonly matchesRepository: Repository<Matches>,
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
    const rankMap: Record<number, Matches> = {};

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
  private assignBlindSeeds(memberList: SingleElimMember[]) {
    shuffleArray(memberList);
    memberList.forEach((member, i) => (member.seedValue = i + 1));
  }
  private getMatchObjFirst({
    member,
    round,
    matchNumber,
  }: {
    member: SingleElimMember;
    round: number;
    matchNumber: number;
  }): Matches {
    return this.matchesRepository.create({
      tournId: member.tournId,
      userId1: member.userId,
      participantName1: member.participantName,
      participantName2: null,
      userId2: null,
      round,
      matchNumber,
    });
  }

  private getMatchObjSecond(
    firstMatchObj: Matches,
    newMember: SingleElimMember,
  ) {
    return {
      ...firstMatchObj,
      participantName2: newMember.participantName,
      userId2: newMember.userId,
    };
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

    //TODO: await this at an appropriate time
    const roundUpdatePromise = this.tournamentService.incrementTournamentRound(
      tournId,
    );

    //TODO: provide an option in SingleElimDetails for deliberate or blind seeding

    if (details.isBlindSeed) this.assignBlindSeeds(members);
    else throw new Error("This logic has not yet been implemented");
    const matches = this.getMatchesForRound({
      memberList: members,
      round: 1,
      tournSize: details.tournSize,
    });
    this.matchesRepository.save(matches);
  }
}
