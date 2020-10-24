import { TournamentVariants } from "../types/tournamentVariants.enum";

export default class CreateTournamentDTO {
  userId: number;
  name: string;
  type: TournamentVariants;
}
