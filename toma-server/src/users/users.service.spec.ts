import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { getInMemoryDB } from "../database/in-memory-db";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let conn: Connection;
  beforeEach(async () => {
    conn = await getInMemoryDB([User]);
    // const users = conn.getRepository(User);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    console.log(service);
  });
  afterEach(async () => {
    await conn.close();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("Creating a valid user", () => {
    it("should return User object", async () => {
      const user = {
        email: "user1@gmail.com",
        username: "u1",
        password: "abcD123!",
      };
      const newUser = await service.create(user);
      expect(newUser.id).toBeDefined;
    });
  });
});
