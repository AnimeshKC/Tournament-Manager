import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) return user;
    throw new HttpException(
      "User with this id does not exist",
      HttpStatus.NOT_FOUND,
    );
  }
  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ username });
    if (user) return user;
    throw new HttpException(
      "User with this username does not exist",
      HttpStatus.NOT_FOUND,
    );
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async create(userData: CreateUserdto): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }
}
