interface IRepository<T> {

  fetchFilteredData(
    filter: Partial<T>,
    page: number,
    limit: number,
    sort: any,
    projection?: Partial<Record<keyof T, 1 | 0>>,
  ): Promise<{ data: T[], totalCount: number }>;

  fetchFilteredDataPageCount(
    filter: Partial<T>,
    limit: number,
  ): Promise<number>

}