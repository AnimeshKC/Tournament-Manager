import { TournamentVariants } from "../types/tournamentVariants.enum";

export default class AddPartipantDTO {
  tournamentType: TournamentVariants;
  participantName: string;
  tournId: number;
}
