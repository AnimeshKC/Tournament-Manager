import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { validateDefined } from "../utilFunctions/validateDefined.util";
import CreateUserDTO from "./dto/createUser.dto";
import { User } from "./entities/user.entity";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    validateDefined(user, "User with this id does not exist");
    return user;
  }
  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ username });
    validateDefined(user, "User with this username does not exist");
    return user;
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async create(userData: CreateUserDTO): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }
}
