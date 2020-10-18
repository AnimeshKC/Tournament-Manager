import { TournamentVariants } from "../types/tournamentVariants.enum";

export default class AddPartipantDto {
  type: TournamentVariants;
  participantName?: string;
  tournId: number;
}
