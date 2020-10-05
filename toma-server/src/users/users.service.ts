import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import CreateUserdto from "./dto/createUser.dto";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  findById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }
  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async create(userData: CreateUserdto): Promise<User> {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }
}
