import { Repository } from "@/Server/RepositoryService/RepositoryService";
import { type IMemberDocument, IMemberDocumentService } from "./IMemberDocumentService";


export class MemberDocumentService implements IMemberDocumentService {
  private repository: Repository<IMemberDocument>;

  constructor() {
    this.repository = new Repository<IMemberDocument>("members");
  }

  /**
   * @async @function createMemberDocument
   * @param document -- IMemberDocument to create
   * @returns documentId
   */
  async createMemberDocument(
    document: Partial<IMemberDocument>
  ) {
    return this.repository.createDocument(document);
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
  async fetchMemberDocuments(
    filter: Partial<IMemberDocument>,
    page: number = 1,
    limit: number = 10,
    sort: any = { lastName: 1, firstName: 1 },
    projection: Partial<Record<keyof IMemberDocument, 1 | 0>> = {},
  ): Promise<{ data: IMemberDocument[], totalCount: number }> {
    return this.repository.fetchDocumentsFiltered(filter, page, limit, sort, projection);
  }

  /**
   * @async @function findMemberDocumentsPageCount
   * @description find and return count of member doc  pages
   * @param [filter={}] -- Partial<T> MongoDB filter
   * @param [limit=10] -- max docs per page
   * @returns Promise { number } -- pages of doc or NaN on error
   */
  async getMemberDocumentsPageCount(
    filter: Partial<IMemberDocument>,
    limit: number = 10,
  ): Promise<number> {
    return this.repository.fetchDocumentFilteredPageCount(filter, limit);
  }

  /**
  * @function fetchMemberDocumentById
  * @async
  * @description find and return Member documents in the db
  * @param [filter={}] -- Partial<T> MongoDB filter
  * @param [page=1] -- which page of results to return 
  * @param [limit=10] -- max docs per page
  * @param [projection={}] -- which doc properties
  * @returns Promise { <data: T[], totalCount:number>} -- projected doc array (up to limit) and size of filtered set
  */
  async fetchMemberDocumentById(
    filter: any,
    projection: any = {}
  ): Promise<IMemberDocument | undefined> {
    return this.repository.fetchDocumentById(filter, projection);
  }

  /**
   * @async @function updateMemberDocument
   * @param filter - mongoDB filter for selecting document (typ[ically the _id])
   * @param updateDocument - object to set/unset document properties
   * @returns document
   */
  async updateMemberDocument(
    documentId: string,
    updateDocument: any
  ) {
    if (documentId) {
      console.log(`updateMemberDocument documentId ${documentId}`)
      return this.repository.updateDocument(documentId, updateDocument);
    } else {
      throw new Error(`updateMemberDocument received undefined document id`);
    }
  }

  /**
 * @async @function deleteMemberDocument
 * @param filter - mongoDB filter for selecting document (typ[ically the _id])
 * @returns count of documents deleted
 */
  async deleteMemberDocument(
    filter: any,
  ) {
    return this.repository.deleteDocument(filter);
  }

};

