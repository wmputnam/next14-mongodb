interface IRepository<T> {

  fetchDocumentsFiltered(
    filter: Partial<T>,
    page: number,
    limit: number,
    sort: any,
    projection?: Partial<Record<keyof T, 1 | 0>>,
  ): Promise<{ data: T[], totalCount: number }>;

  fetchDocumentFilteredPageCount(
    filter: Partial<T>,
    limit: number,
  ): Promise<number>

}