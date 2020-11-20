import {
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from "@nestjs/common";
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
  describe("Data Access", () => {
    const data = [
      {
        id: 1,
        username: "user1",
        email: "user1@gmail.com",
        password: "abcd123!",
      },
      {
        id: 2,
        username: "user2",
        email: "user2@gmail.com",
        password: "abcd123!",
      },
    ];
    describe("findAll", () => {
      it("should return all data", async () => {
        userRepositoryMock.find.mockImplementation(() => data);
        const returnData = await service.findAll();
        expect(returnData).toEqual(data);
      });
    });
    describe("findById", () => {
      it("when id exists, return corresponding user", async () => {
        const existingId = 1;
        const correspondingUser = {
          id: 1,
          username: "user1",
          email: "user1@gmail.com",
          password: "abcd123!",
        };
        userRepositoryMock.findOne.mockImplementation(_ => correspondingUser);
        const returnData = await service.findById(existingId);
        expect(returnData).toEqual(correspondingUser);
      });
      it("when id does not exist, expect an error", async () => {
        const nonexistingId = 50000;
        userRepositoryMock.findOne.mockImplementation(_ => undefined);
        await expect(service.findById(nonexistingId)).rejects.toThrow();
      });
    });
    describe("findByUsername", () => {
      it("when username exists, return corresponding user", async () => {
        const existingUsername = "user2";
        const correspondingUser = {
          id: 2,
          username: "user2",
          email: "user2@gmail.com",
          password: "abcd123!",
        };
        userRepositoryMock.findOne.mockImplementation(_ => correspondingUser);
        const user = await service.findByUsername(existingUsername);
        expect(user).toEqual(correspondingUser);
      });
      it("when username does not exist, expect an error", async () => {
        const nonexistingUser = "DoesNotExistUser123";
        userRepositoryMock.findOne.mockImplementation(_ => undefined);
        await expect(service.findByUsername(nonexistingUser)).rejects.toThrow();
      });
    });
    describe("remove", () => {
      it("function returns regardless of whether the id exists", async () => {
        const existingId = 1;
        const nonexistingId = 90000;

        //return value of delete doesn't matter for this test, since remove doesn't return anything
        userRepositoryMock.delete.mockImplementation(_ => _);
        expect(service.remove(existingId)).resolves;
        expect(service.remove(nonexistingId)).resolves;
      });
    });
    describe("create", () => {
      it("if user is valid, return user", async () => {
        const newUser = {
          username: "user3",
          email: "user3@gmail.com",
          password: "abcd123!",
        };
        const createdUser = { ...newUser, id: 3 };
        userRepositoryMock.create.mockImplementation(_ => createdUser);
        userRepositoryMock.save.mockImplementation(_ => _);
        expect(await service.create(newUser)).toEqual(createdUser);
      });
      it("if user already exists, throws an error", async () => {
        const existingUser = {
          id: 1,
          username: "user1",
          email: "user1@gmail.com",
          password: "abcd123!",
        };

        userRepositoryMock.save.mockImplementation(_ => {
          throw new Error("Duplicate error");
        });
        await expect(service.create(existingUser)).rejects.toThrow();
      });
    });
  });
});
