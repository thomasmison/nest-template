export interface ListInterface<T> {
  data: T[];
  totalItems: number;
}

export class ListBuilder<T> {
  constructor(private data: T[]) {}

  // @TODO add pagination
  build(): ListInterface<T> {
    return {
      data: this.data,
      totalItems: this.data.length,
    };
  }
}
