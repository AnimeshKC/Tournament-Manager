export interface SeedObject {
  seedValue?: number;
  [propName: string]: any;
}

//Uses the Fiser Yates Algorithm
function shuffleArray<T>(array: T[]): T[] {
  if (array.length <= 1) return array;
  for (let i = array.length - 1; i >= 1; i--) {
    const swapIndex = Math.floor((i + 1) * Math.random()); //a random index between 0 and i
    [array[i], array[swapIndex]] = [array[swapIndex], array[i]];
  }
  return array;
}

export function getTournSize(memberSize: number) {
  if (memberSize <= 1) throw new Error("Invalid input");
  let tournSize = 2;
  while (tournSize < memberSize) {
    tournSize = tournSize * 2;
  }
  return tournSize;
}

/*
Currently only blind seeds

Potential Consideration: add logic for pre-tournament rankings, e.g. ELO

*/
export function assignSeedValues(memberList: SeedObject[]) {
  //shuffle so that order of members in DB does not matter for seeding
  //this is only needed for blind seed assignment
  shuffleArray(memberList);

  //by using the index to assign seeds, the lowest seed values have the highest priority for byes
  //this is acceptable in both the blind case and the seeded case
  memberList.forEach((member, i) => (member.seedValue = i + 1));
}
