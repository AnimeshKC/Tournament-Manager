import { assignSeedValues, SeedObject } from "./assignSeed.singleElim";

export interface MatchMember {
  seedValue: number;
  roundEliminated?: number;
  participantName?: string;
  userId?: number;
  tournId: number;
  round: number;
  [propName: string]: any;
}

export interface MatchObject {
  userId1?: number;
  participantName1?: string;
  userId2?: number;
  participantName2?: string;
  tournId: number;
  round: number;
}
//throws an error if round isn't valid for the number of members
//Ex. A round 3 is only possible if more than 4 members are in the tournament
function validateNaturalNumber(num: number) {
  // const validRound = Number.isInteger(num) && num > 0;
  // if (!validRound) throw new Error("Invalid Round");
}

function validateRoundForSize(round: number, memberSize: number) {
  validateNaturalNumber(round);
  if (memberSize * 2 <= Math.pow(2, round))
    throw new Error("Round exceeds bound for this size of members");
}

function getRoundValue(round: number, seed: number) {
  validateNaturalNumber(round);
  validateNaturalNumber(seed);
  return Math.ceil(seed / Math.pow(2, round - 1));
}

function getSoloMatch(member: MatchMember, round: number) {
  return {
    tournId: member.tournId,
    userId1: member.userId,
    participantName1: member.participantName,
    participantName2: null,
    userId2: null,
    round,
  };
}

function getMatchesForRound(
  memberList: MatchMember[],
  round: number,
  isSorted = false,
) {
  const memberSize = memberList.length;

  const sortedMemberList = isSorted
    ? memberList
    : [...memberList].sort(
        (member1, member2) => member1.seedValue - member2.seedValue,
      );

  /*if member.roundEliminated is null, user has not been eliminated*/
  /*Second condition is in case the function is being called for a round that has already 
  passed. Members eliminated in later rounds are not filtered out
    */
  const remainingMembers = sortedMemberList.filter(
    member => !member.roundEliminated || member.roundEliminated >= round,
  );
  let i = 0;
  const matches: MatchObject[] = [];

  /*
    In the ideal case, i will increment by 2 each time and range from 0 ... memberSize-2
    but there will be edge cases when missing members are involved.
  */
  while (i < memberSize) {
    const leftMember = remainingMembers[i];

    if (i === memberSize - 1) {
      matches.push(getSoloMatch(leftMember, round));
      return matches;
    }
    const rightMember = remainingMembers[i + 1];
    const {
      seedValue: rightSeed,
      userId: userId2,
      participantName: participantName2,
    } = rightMember;

    const leftRoundValue = getRoundValue(round, leftMember.seedValue);
    const rightRoundValue = getRoundValue(round, rightSeed);

    const isAMatch = leftRoundValue === rightRoundValue - 1;
    if (isAMatch) {
      matches.push({
        userId1: leftMember.userId,
        participantName1: leftMember.participantName,
        participantName2: rightMember.participantName,
        userId2: rightMember.userId,
        tournId: leftMember.tournId,
        round,
      });
      i += 2;
    } else {
      matches.push(getSoloMatch(leftMember, round));
      i++;
    }
  }
  return matches;
}

const memberList: SeedObject[] = [
  { participantName: "p1" },
  { participantName: "p2" },
  { participantName: "p3" },
  { participantName: "p4" },
  { participantName: "p5" },
  //   { userId: 6 },
  //   { participantName: "p7" },
  //   { userId: 8 },
];

const seededMemberList: MatchMember[] = memberList.map(member => ({
  ...member,
  seedValue: 0,
  round: 1,
  tournId: 1,
}));

assignSeedValues(seededMemberList);

console.log(getMatchesForRound(seededMemberList, 1));
// console.log(seededMemberList);
// for (const member of seededMemberList) {
//   console.log(
//     getRoundValue(1, member.seedValue),
//     getRoundValue(2, member.seedValue),
//     getRoundValue(3, member.seedValue),
//   );
// }
