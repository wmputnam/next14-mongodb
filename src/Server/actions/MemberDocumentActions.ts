'use server';
import { z } from 'zod';
import { IMemberDocument } from "../Service/MemberDocumentService";
import { MemberDocumentService } from "../Service/MemberDocumentService/MemberDocumentService";
import { State } from "./actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// import { UpdateMemberDocument } from '@/app/ui/members/buttons';

const FormSchema = z.object({
  id: z.string(),
  lastName: z.string(),
  firstName: z.string(),
  streetAddress: z.string(),
  unit: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  email: z.string(),
  phone: z.string(),

  date: z.string(),
});

const CreateMemberDocument = FormSchema.omit({ id: true, date: true });
const UpdateMemberDocument = FormSchema.omit({ id: true, date: true });



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
 @server @async @function fetchMembersPageCount
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
 @server @async @function createMember() 
 * @param data -- member document to create
 * @returns Promise<documentId>
 */
export const createMember = async (data: Partial<IMemberDocument>) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.createMemberDocument(data);
}

/**
 * @server @async @function fetchMemberById(memberDocId: string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @param projection -- document properties to return
 * @returns Promise<Partial<IMember>>
 */
export const fetchMemberById = async (filter: any, projection: any = {}) => {
  const memberDocumentService = new MemberDocumentService();
  // console.log(`fetchMemberById: filter: ${JSON.stringify(filter)}`);
  return await memberDocumentService.fetchMemberDocumentById(filter, projection);
}

/**
 @server @async @function updateMemberById(memberDocId:string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @param data -- mongodb update document (set/unset)
 * @returns Promise<IMember>
 */
export const updateMemberById = async (filter: any, data: Partial<IMemberDocument>) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.updateMemberDocument(filter, data);
}

export async function updateMemberFormAction(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  console.log(`updateMember FormData: ${JSON.stringify(formData)}`);

  const validatedFields = UpdateMemberDocument.safeParse({
    lastName: formData.get('lastName'),
    firstName: formData.get('firstName'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  // Prepare data for database update
  const { lastName, firstName } = validatedFields.data;


  try {
    updateMemberById({ _id: id }, { lastName: lastName, firstName: firstName });
    return { message: 'ok' };
  } catch (err: any) {
    console.log(`Database Error: Failed to Update Invoice: ${JSON.stringify(err)}`);
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }
  // Update data in the database
  //   await sql`
  //   UPDATE invoices
  //   SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
  //   WHERE id = ${id}
  //   `;


  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/members');
  redirect('/dashboard/members');

}


/**
 @server @async @function deleteMemberById(memberDocId: string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @returns Promise<number of documents deleted>
 */
export const deleteMemberById = async (filter: any) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.deleteMemberDocument(filter);
}
