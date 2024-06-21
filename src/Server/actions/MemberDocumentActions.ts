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
  sort:any = {}
) => {
  const memberDocumentService = new MemberDocumentService();
  // console.log(`fetchMembers: sort:${JSON.stringify(sort)}`);

  return await memberDocumentService.findMemberDocuments(filter, pageNumber, itemsPerPage, sort,projection);
};

/**
 * @async @function fetchMembersPageCount
 * @description -- retrieve member documents page count as filtered
 * @param itemsPerPage -- max docs per page
 * @param filter -- mongoDB filter
 * @returns number of pages
 */
export const fetchMembersPageCount = async (
  itemsPerPage: number = 10,
  filter: Partial<IMemberDocument> = { isActive: true },
) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.findMemberDocumentsPageCount(filter, itemsPerPage);
}

/**
 * @async @function createMember() 
 */
export const createMember = async (data: Partial<IMemberDocument>) => { 
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.findMemberDocumentsPageCount(filter, itemsPerPage);
}

/**
 * @async @function fetchMemberById(memberDocId: string) 
 */
export const fetchMemberById = async (documentId:string, projection:any = {}) => { 
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.findMemberDocumentById(documentId,projection);
}

/**
 * @async @function updateMemberById(memberDocId:string) 
 */
export const updateMemberById = async (memberDocId: string, data:Partial<IMemberDocument>) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.findMemberDocumentsPageCount(filter, itemsPerPage);
}

/**
 * @async @function deleteMemberById(memberDocId: string) 
 */
export const deleteMemberById = async (memberDocId: string) => { 
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.findMemberDocumentsPageCount(filter, itemsPerPage);
}
