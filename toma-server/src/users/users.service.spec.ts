import { ServiceUnavailableException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { MockType } from "../../test/mock.type";
import { repositoryMockFactory } from "../../test/repositoryMock.factory";
import { getInMemoryDB } from "../database/in-memory-db";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let userRepositoryMock: MockType<Repository<User>>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get(getRepositoryToken(User));
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("data access", () => {
    it("should return all data", async () => {
      const data = [
        {
          id: 1,
          username: "user1",
          email: "user1@gmail.com",
          password: "abcd123!",
        },
      ];
      userRepositoryMock.find.mockImplementation(() => data);
      const returnData = await service.findAll();
      expect(returnData).toEqual(data);
    });
  });
});
