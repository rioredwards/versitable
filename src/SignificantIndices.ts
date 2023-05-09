// This is a helper class to keep track of significant indices in Table
// The key functionality is that whenever a new index is added,
// all indices greater than the new index are incremented by 1
// This reflects the shifting of indices whenever a new row or column is added to the table

import { SignificantIndicesType } from "./tableTypes";

export class SignificantIndices implements SignificantIndicesType {
  _indices: number[];

  constructor(indices?: number[]) {
    this._indices = indices || [];
  }

  get length() {
    return this._indices.length;
  }

  get indices() {
    return this._indices;
  }

  addIndex(idx: number) {
    // If its the first insertion, just push it and return
    if (this._indices.length === 0) {
      this._indices.push(idx);
      return;
    }

    // Find the position to insert the new idx while maintaining the order
    const position = this._indices.findIndex((element) => element >= idx);
    if (position === -1) {
      this._indices.push(idx);
    } else {
      this._indices.splice(position, 0, idx);
      // Update the indices greater than the inserted idx
      for (let i = position + 1; i < this._indices.length; i++) {
        this._indices[i]++;
      }
    }
  }

  addIndices(idx: number[]) {
    // (Assume idx is sorted)
    // When adding multiple indices, each insertion will shift following indices by 1, so add idx to element
    idx.forEach((element, idx) => this.addIndex(element + idx));
  }

  shiftIndices(idx: number, shift: number) {
    // Shift all indices at or greater than idx by shift
    for (let i = idx; i < this._indices.length; i++) {
      this._indices[i] += shift;
    }
  }
}
