import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MockType } from "../../test/mock.type";
import { repositoryMockFactory } from "../../test/repositoryMock.factory";
import { Tournament } from "./entities/tournament.entity";
import { TournGenericService } from "./tournGeneric.service";
import { MemberVariants } from "./types/memberTables.enum";

describe("TournGenericService", () => {
  let service: TournGenericService;
  let tournRepositoryMock: MockType<Repository<Tournament>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournGenericService,
        {
          provide: getRepositoryToken(Tournament),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<TournGenericService>(TournGenericService);
    tournRepositoryMock = module.get(getRepositoryToken(Tournament));
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("getTournamentWithMembers", () => {
    describe("For SingleElimination Table", () => {
      const tournId = 1;
      const tournData = {
        id: 1,
        singleElimMembers: [
          {
            id: 1,
          },
        ],
      };
      it("returns tournament with Single Elim Members filled out", async () => {
        tournRepositoryMock.findOne.mockImplementation(_ => tournData);
        const tournament = await service.getTournamentWithMembers({
          memberTableString: MemberVariants.singleElim,
          tournId,
        });
        expect(tournament).toEqual(tournData);
      });
      it("if tournId does not exist, expect an error", async () => {
        const nonExistantTournId = 1000;
        tournRepositoryMock.findOne.mockImplementation(_ => undefined);
        await expect(
          service.getTournamentWithMembers({
            memberTableString: MemberVariants.singleElim,
            tournId: nonExistantTournId,
          }),
        ).rejects.toThrow();
      });
      it("if a non-singleElim memberString is passed, expect empty singleElimMember", async () => {
        tournRepositoryMock.findOne.mockImplementation(_ => ({
          ...tournData,
          singleElimMembers: [],
        }));
        const tournament = await service.getTournamentWithMembers({
          memberTableString: MemberVariants.doubleElim,
          tournId,
        });
        expect(tournament.id).toEqual(tournData.id);
        expect(tournament.singleElimMembers).toEqual([]);
      });
    });
  });
  describe("getTournament", () => {
    const tournData = { id: 1 };
    it("if id exists, return the tournament data", async () => {
      const existingId = 1;
      tournRepositoryMock.findOne.mockImplementation(_ => tournData);
      const result = await service.getTournament(existingId);
      expect(result).toEqual(tournData);
    });
    it("if id does not exist, expect an error", async () => {
      const nonExistantTournId = 10000;
      tournRepositoryMock.findOne.mockImplementation(_ => null);
      await expect(service.getTournament(nonExistantTournId)).rejects.toThrow();
    });
  });
  describe("incrementTournamentRound", () => {});
});
