import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SingleElimMember } from "./entities/singleElimMember.entity";

@Injectable()
export class SingleEliminationService {
  constructor(
    @InjectRepository(SingleElimMember)
    singleElimRepository: Repository<SingleElimMember>,
  ) {}
}
