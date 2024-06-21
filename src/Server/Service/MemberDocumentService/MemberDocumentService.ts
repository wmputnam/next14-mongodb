import { Repository } from "@/Server/RepositoryService/RepositoryService";
import { type IMemberDocument, IMemberDocumentService } from "./IMemberDocumentService";


export class MemberDocumentService implements IMemberDocumentService {
  private repository: Repository<IMemberDocument>;

  constructor() {
    this.repository = new Repository<IMemberDocument>("members");
  }

  /**
 * @function findMemberDocuments
 * @async
 * @description find and return Member documents in the db
 * @param [filter={}] -- Partial<T> MongoDB filter
 * @param [page=1] -- which page of results to return 
 * @param [limit=10] -- max docs per page
 * @param [projection={}] -- which doc properties
 * @returns Promise { <data: T[], totalCount:number>} -- projected doc array (up to limit) and size of filtered set
 */
  async findMemberDocuments(
    filter: Partial<IMemberDocument>,
    page: number = 1,
    limit: number = 10,
    sort: any = { lastName: 1, firstName: 1 },
    projection: Partial<Record<keyof IMemberDocument, 1 | 0>> = {},
  ): Promise<{ data: IMemberDocument[], totalCount: number }> {
    console.log(`findMemberDocuments: sort:${JSON.stringify(sort)}`)

    return this.repository.fetchFilteredData(filter, page, limit, sort, projection);
  }

  /**
 * @async @function findMemberDocumentsPageCount
 * @description find and return count of member doc  pages
 * @param [filter={}] -- Partial<T> MongoDB filter
 * @param [limit=10] -- max docs per page
 * @returns Promise { number } -- pages of doc or NaN on error
 */
  async findMemberDocumentsPageCount(
    filter: Partial<IMemberDocument>,
    limit: number = 10,
  ): Promise<number> {
    return this.repository.fetchFilteredDataPageCount(filter, limit);
  }

};

