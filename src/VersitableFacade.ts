// This is the return type of the make() method on the Versitable class.
// Users will interact with this class.
export class VersitableFacade extends Array<string[]> {
  private stringTable: string[][];

  constructor(stringTable: string[][]) {
    super(...stringTable);
    this.stringTable = stringTable;
  }

  print(): void {
    const joinedTable = this.stringTable.map((row) => row.join("")).join("\n");
    console.log(joinedTable);
  }
}
