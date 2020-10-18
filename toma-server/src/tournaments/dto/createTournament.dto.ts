import { TournamentVariants } from "../types/tournamentVariants.enum";

export default class CreateTournamentDto {
  userId: number;
  name: string;
  type: TournamentVariants;
}
