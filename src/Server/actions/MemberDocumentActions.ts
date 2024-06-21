'use server';

import { IMemberDocument } from "../Service/MemberDocumentService";
import { MemberDocumentService } from "../Service/MemberDocumentService/MemberDocumentService";

/**
 * @asysnc @function fetchMembers
 * @description -- retrieve member documents as filtered and projected as array and total count of docs in set
 * @param pageNumber -- offset in groups of itemsPerPage
 * @param itemsPerPage -- max number of docs to return
 * @param filter  -- MongoDB filter
 * @param projection -- which document elements to return
 * @returns Promise {data: IMemberDocument array, totalCount: number of docs in filtered set}
 */
export const fetchMembers = async (
  pageNumber: number,
  itemsPerPage: number = 10,
  filter: Partial<IMemberDocument> = {},
  projection: Object = {},
  sort: any = {}
) => {
  const memberDocumentService = new MemberDocumentService();
  // console.log(`fetchMembers: sort:${JSON.stringify(sort)}`);

  return await memberDocumentService.fetchMemberDocuments(filter, pageNumber, itemsPerPage, sort, projection);
};

/**
 * @async @function fetchMembersPageCount
 * @description -- retrieve member documents page count as filtered
 * @param itemsPerPage -- max docs per page
 * @param filter -- mongoDB filter
 * @returns Promise<number of pages>
 */
export const fetchMembersPageCount = async (
  itemsPerPage: number = 10,
  filter: Partial<IMemberDocument> = { isActive: true },
) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.getMemberDocumentsPageCount(filter, itemsPerPage);
}

/**
 * @async @function createMember() 
 * @param data -- member document to create
 * @returns Promise<documentId>
 */
export const createMember = async (data: Partial<IMemberDocument>) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.createMemberDocument(data);
}

/**
 * @async @function fetchMemberById(memberDocId: string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @param projection -- document properties to return
 * @returns Promise<Partial<IMember>>
 */
export const fetchMemberById = async (filter:any, projection: any = {}) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.fetchMemberDocumentById(filter, projection);
}

/**
 * @async @function updateMemberById(memberDocId:string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @param data -- mongodb update document (set/unset)
 * @returns Promise<IMember>
 */
export const updateMemberById = async (filter:any, data: Partial<IMemberDocument>) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.updateMemberDocument(filter, data);
}

/**
 * @async @function deleteMemberById(memberDocId: string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @returns Promise<number of documents deleted>
 */
export const deleteMemberById = async (filter:any) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.deleteMemberDocument(filter);
}
