interface SingleElimMember {
  pname?: string;
  seedValue?: number;
  uid?: number;
}
function getTournSize(memberSize: number) {
  if (memberSize <= 1) throw new Error("Invalid input");
  let tournSize = 2;
  while (tournSize < memberSize) {
    tournSize = tournSize * 2;
  }
  return tournSize;
}
function assignSeedValues(membersList: SingleElimMember[]) {
  const memberSize = membersList.length;
  const tournSize = getTournSize(memberSize);
  let memberIndex = 0;
  for (let i = 0; i < Math.floor(tournSize / 2); i++) {
    membersList[memberIndex].seedValue = 1 + i * 2;
    memberIndex++;
  }
  let i = 0;
  while (memberIndex < memberSize) {
    membersList[memberIndex].seedValue = 2 + i * 2;
    memberIndex++;
    i++;
  }
  console.log(membersList);
}

const membersList: SingleElimMember[] = [
  { pname: "p1" },
  { pname: "p2" },
  { pname: "p3" },
  { pname: "p4" },
  { pname: "p5" },
  { uid: 6 },
  { pname: "p7" },
  { uid: 8 },
  { uid: 9 },
];
for (const member of membersList) {
  member.seedValue = 0;
}

assignSeedValues(membersList);
