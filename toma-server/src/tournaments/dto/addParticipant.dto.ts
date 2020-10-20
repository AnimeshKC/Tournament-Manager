import { TournamentVariants } from "../types/tournamentVariants.enum";

export default class AddPartipantDto {
  tournamentType: TournamentVariants;
  participantName: string;
  tournId: number;
}
