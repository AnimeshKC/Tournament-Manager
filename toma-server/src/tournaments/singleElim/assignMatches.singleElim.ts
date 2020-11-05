import { assignSeedValues, SeedObject } from "./assignSeed.singleElim";

export interface MatchMember {
  seedValue: number;
  roundEliminated?: number;
  participantName?: string;
  userId?: number;
  tournId: number;
  [propName: string]: any;
}

export interface MatchObject {
  userId1?: number;
  participantName1?: string;
  userId2?: number;
  participantName2?: string;
  tournId: number;
  round: number;
  matchNumber: number;
}
//throws an error if round isn't valid for the number of members
//Ex. A round 3 is only possible if more than 4 members are in the tournament
function validateNaturalNumber(num: number) {
  // const validRound = Number.isInteger(num) && num > 0;
  // if (!validRound) throw new Error("Invalid Round");
}

function getRoundValue(round: number, seed: number) {
  validateNaturalNumber(round);
  validateNaturalNumber(seed);
  return Math.ceil(seed / Math.pow(2, round - 1));
}

function generateFirstMatchMember({
  member,
  round,
  matchNumber,
}: {
  member: MatchMember;
  round: number;
  matchNumber: number;
}): MatchObject {
  return {
    tournId: member.tournId,
    userId1: member.userId,
    participantName1: member.participantName,
    participantName2: null,
    userId2: null,
    round,
    matchNumber,
  };
}
function generateSecondMatchMember(
  oldMatchObj: MatchObject,
  newMember: MatchMember,
) {
  return {
    ...oldMatchObj,
    participantName2: newMember.participantName,
    userId2: newMember.userId,
  };
}

function getMatchNumber({
  seedValue,
  round,
  tournSize,
}: {
  seedValue: number;
  round: number;
  tournSize: number;
}) {
  /*
  Second-half seedValues have the same matchNumber as their first-half counterparts
  ex. in a 16 person tournament:
    (<matchNumber>, [<lowerSeed>,<higherSeed>]) ->
     [(1, [1, 16]), (2, [2, 15], ... (8, [8, 9]))
  */
  const firstRoundNumber =
    seedValue <= tournSize / 2 ? seedValue : tournSize - seedValue + 1;

  //e.g. winner of the 8th match of round 1 will be in the 4th match of round 2 and the 2nd match of round 3
  const matchNumber = Math.ceil(firstRoundNumber / Math.pow(2, round - 1));

  return matchNumber;
}
//database should have already filtered out the members who have been eliminated
function getMatchesForRound({
  memberList,
  round,
  tournSize,
}: {
  memberList: MatchMember[];
  round: number;
  tournSize: number;
}) {
  const rankMap: Record<number, MatchObject> = {};

  for (const member of memberList) {
    const matchNumber = getMatchNumber({
      seedValue: member.seedValue,
      tournSize,
      round,
    });
    if (matchNumber in rankMap) {
      rankMap[matchNumber] = generateSecondMatchMember(
        rankMap[matchNumber],
        member,
      );
    } else
      rankMap[matchNumber] = generateFirstMatchMember({
        member,
        round,
        matchNumber,
      });
  }
  const matches = Object.values(rankMap);
  matches.sort((a, b) => a.matchNumber - b.matchNumber);
  return matches;
}

const memberList: SeedObject[] = [
  { participantName: "p1" },
  { participantName: "p2" },
  { participantName: "p3" },
  { participantName: "p4" },
  { participantName: "p5" },
  { userId: 6 },
  { participantName: "p7" },
  { userId: 8 },
];

const seededMemberList: MatchMember[] = memberList.map(member => ({
  ...member,
  seedValue: 0,
  tournId: 1,
}));

assignSeedValues(seededMemberList);
//for the test purposes, sort the list so that the matches are already paired up
seededMemberList.sort(
  (member1, member2) => member1.seedValue - member2.seedValue,
);

//round 1
// console.log(getMatchesForRound(seededMemberList, 1, true));

//round 2

seededMemberList[1].roundEliminated = 1;
seededMemberList[2].roundEliminated = 1;
seededMemberList[5].roundEliminated = 1;
seededMemberList[6].roundEliminated = 1;
// console.log(getMatchesForRound(seededMemberList, 2, true));

//round 3

seededMemberList[0].roundEliminated = 1;
seededMemberList[7].roundEliminated = 1;
// console.log(getMatchesForRound(seededMemberList, 3, true));

//winner
seededMemberList[3].roundEliminated = 1;
// console.log(
//   getMatchesForRound({
//     memberList: seededMemberList,
//     round: 4,
//     tournSize: true,
//   }),
// );

// console.log(seededMemberList);
// for (const member of seededMemberList) {
//   console.log(
//     getRoundValue(1, member.seedValue),
//     getRoundValue(2, member.seedValue),
//     getRoundValue(3, member.seedValue),
//   );
// }
