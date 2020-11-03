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

function getTournSize(memberSize: number) {
  if (memberSize <= 1) throw new Error("Invalid input");
  let tournSize = 2;
  while (tournSize < memberSize) {
    tournSize = tournSize * 2;
  }
  return tournSize;
}

/*
Takes in an array of objects that have a seedValue property and overwrites it
with an assigned seeding. 

Potential Consideration: add logic for pre-tournament rankings, e.g. ELO

*/
export function assignSeedValues(memberList: SeedObject[]) {
  //shuffle so that order of members in DB does not matter for seeding
  //this may not be needed if seeding is done with some rating
  shuffleArray(memberList);

  const memberSize = memberList.length;
  const tournSize = getTournSize(memberSize);
  let memberIndex = 0;

  /*
  left seed values of each match e.g. 1,3,5,7
  Populate these first for the purpose of byes
  This ensures that each match has at least one member,
  so that the byes are settled in the first round  
  */
  for (let i = 0; i < Math.floor(tournSize / 2); i++) {
    memberList[memberIndex].seedValue = 1 + i * 2;
    memberIndex++;
  }

  //Any remaining members will fill up corresponding right seeds of matches e.g. 2,4,6,8
  let i = 0;
  while (memberIndex < memberSize) {
    memberList[memberIndex].seedValue = 2 + i * 2;
    memberIndex++;
    i++;
  }
}
