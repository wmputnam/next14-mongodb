import { IMemberDocument } from "./IMemberDocument";
export interface IMemberDocumentService {
  findMemberDocuments(
    filter: Partial<IMemberDocument>,
    page: number,
    limit: number,
    sort: any,
    projection: Partial<Record<keyof IMemberDocument, 1 | 0>>,)
    : Promise<{ data: IMemberDocument[], totalCount: number }>;
}
export { type IMemberDocument };