import { TournamentServiceVariants } from "./tournamentServiceVariants.enum";
import { TournamentVariants } from "./tournamentVariants.enum";
const a = TournamentVariants.SINGLE_ELIM;

export const variantToServiceMap: Record<
  TournamentVariants,
  TournamentServiceVariants
> = {
  [TournamentVariants.SINGLE_ELIM]: TournamentServiceVariants.SINGLE_ELIM,
};
