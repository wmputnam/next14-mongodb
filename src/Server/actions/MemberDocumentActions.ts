'use server';
import { z } from 'zod';
import { IMemberDocument } from "../Service/MemberDocumentService";
import { MemberDocumentService } from "../Service/MemberDocumentService/MemberDocumentService";
import { State } from "./actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { pathname } from 'next-extra/pathname';

// import { UpdateMemberDocument } from '@/app/ui/members/buttons';

const FormSchema = z.object({
  id: z.string(),
  lastName: z.string(),
  firstName: z.string(),
  streetAddress: z.string().optional(),
  unit: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  mmb: z.string(),
  isActive: z.boolean(),
  validPostMail: z.enum(['valid', 'none', 'returned mail']),
  validEmail: z.enum(['none', 'verified', 'bounced', 'unchecked']),
  newsletterType: z.enum(['email', 'none', 'post', 'opted out']),
  lastUpdated: z.string(),
});

const CreateMemberDocument = FormSchema.omit({
  id: true,
  lastUpdated: true,
});
const UpdateMemberDocument = FormSchema.omit({
  id: true,
  lastUpdated: true
});


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
  filter: any = {},
  projection: Object = {},
  sort: any = {}
) => {
  const memberDocumentService = new MemberDocumentService();
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

const MEMBERS_PAGE_PATH = '/dashboard/members';

export async function createMemberFormAction(
  prevState: State,
  formData: FormData,
): Promise<State> {

  // *** first process the form data passed
  // first name, last name, isActive
  const rawFormData = {
    lastName: formData.get('lname'),
    firstName: formData.get('fname'),
  } as any;

  // street address
  const streetAddress = formData.get('address');
  if (streetAddress) {
    rawFormData['streetAddress'] = streetAddress
  }

  // unit
  const unit = formData.get('unit');
  if (unit) {
    rawFormData['unit'] = unit
  }

  // city
  const city = formData.get('city');
  if (city) {
    rawFormData['city'] = city
  }

  // state
  const state = formData.get('state');
  if (state) {
    rawFormData['state'] = state
  }

  // postal code a.k.a ZIPcode in US
  const postalCode = formData.get('postalcode');
  if (postalCode) {
    rawFormData['postalCode'] = postalCode
  }

  // email & 
  const email = formData.get('email');
  if (email) {
    rawFormData['email'] = email;
  }

  // validPostMail
  if (streetAddress && streetAddress !== "" &&
    city && city !== "" &&
    state && state !== "" &&
    postalCode && postalCode !== ""
  ) {
    rawFormData['validPostMail'] = 'valid';
  } else {
    rawFormData['validPostMail'] = 'none';
  }

  // phone
  const phone = formData.get('phone');
  if (phone) {
    rawFormData['phone'] = phone
  }

  // *** next set up derivative data
  // validEmail
  if (email) {
    rawFormData['validEmail'] = 'unchecked';
  } else {
    rawFormData['validEmail'] = 'none';
  }

  // newsletterType
  if (rawFormData['validEmail'] && rawFormData['validEmail'] !== 'none') {
    rawFormData['newsletterType'] = 'email';
  } else if (rawFormData['validPostMail'] && rawFormData['validPostMail'] !== 'none') {
    rawFormData['newsletterType'] = 'post';
  } else {
    rawFormData['newsletterType'] = 'none';
  }

  // mmb
  rawFormData['mmb'] = ' VOL';

  // *** finally, check the form data for missing or incorrect values
  const validatedFields = CreateMemberDocument.safeParse(rawFormData);

  // *** If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Member document.',
    };
  }

  // *** save the new member document
  // *** if save fails return failure information
  // *** otherwise redirect to members table page
  try {
    createMember(validatedFields?.data);
  } catch (err: any) {
    return {
      message:
        `Database Error: Failed to Create Member document. : ${JSON.stringify(err?.message)}`
    };
  };


  // *** Revalidate the cache for the members page and redirect the user.
  revalidatePath(MEMBERS_PAGE_PATH);

  // *** And redirect to the new URL
  redirect(MEMBERS_PAGE_PATH);
}


/**
 * @server @async @function fetchMemberById(memberDocId: string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @param projection -- document properties to return
 * @returns Promise<Partial<IMember>>
 */
export const fetchMemberById = async (filter: any, projection: any = {}) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.fetchMemberDocumentById(filter, projection);
}

/**
 @server @async @function updateMemberById(memberDocId:string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @param data -- mongodb update document (set/unset)
 * @returns Promise<IMember>
 */
export const updateMemberById = async (documentId: string, data: Partial<IMemberDocument>) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.updateMemberDocument(documentId, data);
}

export async function updateMemberFormAction(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {

  // *** get the editable field data from the form
  // first name, last name
  const rawFormData = {
    lastName: formData.get('lname'),
    firstName: formData.get('fname'),
  } as any;

  // street address
  const streetAddress = formData.get('address');
  if (streetAddress) {
    rawFormData['streetAddress'] = streetAddress
  }

  // unit
  const unit = formData.get('unit');
  if (unit) {
    rawFormData['unit'] = unit
  }

  // city
  const city = formData.get('city');
  if (city) {
    rawFormData['city'] = city
  }

  // state
  const state = formData.get('state');
  if (state) {
    rawFormData['state'] = state
  }

  // postal code a.k.a ZIPcode in US
  const postalCode = formData.get('postalcode');
  if (postalCode) {
    rawFormData['postalCode'] = postalCode
  }

  // email & 
  const email = formData.get('email');
  if (email) {
    rawFormData['email'] = email;
  }

  // phone
  const phone = formData.get('phone');
  if (phone) {
    rawFormData['phone'] = phone
  }



  // validPostMail
  // *** did this address data change?
  // *** how does that change impact the validPostMail?
  const isAddressComplete = (
    (streetAddress ?? '') !== '' &&
    (city ?? '') !== '' &&
    (state ?? '') !== '' &&
    (postalCode ?? '') !== ''
  );
  /*
  'none' & incomplete prior address & complete address => 'valid'
  'returned mail' & complete address & change to address => 'valid'
  ( 'returned mail' | 'valid' ) & incomplete address => 'none'
  */
  const priorValidPostMail = formData.get('priorvalidpostmail');
  const isPriorAddressComplete = ['valid', 'returned mail'].includes(priorValidPostMail as unknown as string ?? '');
  const priorStreetAddress = formData.get('prioraddress');
  const priorCity = formData.get('priorcity');
  const priorState = formData.get('priorstate');
  const priorPostalCode = formData.get('priorpostalcode');
  const isAddressChanged = (
    (priorStreetAddress ?? '') !== (streetAddress ?? '') &&
    (priorCity ?? '') !== (city ?? '') &&
    (priorState ?? '') !== (state ?? '') &&
    (priorPostalCode ?? '') !== (postalCode ?? '')
  );
  if (isAddressComplete) {
    switch (priorValidPostMail ?? '') {
      case 'none':
      case '':
        if (!isPriorAddressComplete) {
          rawFormData['validPostMail'] = 'valid';
        }
        break;
      case 'returned mail':
        if (isPriorAddressComplete && isAddressChanged) {
          rawFormData['validPostMail'] = 'valid';
        }
        break;
    }
  } else {
    rawFormData['validPostMail'] = 'none';
  }

  // validEmail
  // *** did this email data change?
  // *** how does that change impact the validEmail?
  const priorEmail = formData.get('prioremail');

  console.log(`updateMemberFormAction email:${email}`);
  console.log(`updateMemberFormAction prioremail:${formData.get('prioremail')}`);

  if ((email ?? '') === '') {
    rawFormData['validEmail'] = 'none';
  } else {
    const priorValidEmail = formData.get('priorvalidemail');

    const isEmailChanged = (
      ((email ?? '') !== (priorEmail ?? ''))
    );

    console.log(`updateMemberFormAction priorValidEmail:${priorValidEmail}`);
    console.log(`updateMemberFormAction isEmailChanged:${isEmailChanged}`);

    switch (priorValidEmail ?? '') {
      case 'none':
      case '':
        rawFormData['validEmail'] = 'unchecked';
        break;
      case 'valid':
      case 'unchecked':
      case 'bounced':
        if (isEmailChanged) {
          rawFormData['validEmail'] = 'unchecked';
        } else {
          rawFormData['validEmail'] = priorValidEmail;
        }
    }
  }

  // newsletterType
  // *** did validPostMail  and or validEmail data change?
  // *** how does that change impact the newsletterType?
  // const priorValidPostMail = formData.get('priorvalidpostmail');
  // const priorValidEmail = formData.get('priorvalidemail');
  const priorNewsletterType = formData.get('priornewslettertype');

  // const isValidPostMailChanged = (
  //   ((priorValidPostMail ?? '') !== rawFormData['validPostMail'])
  // );
  // const isValidEmailChanged = (
  //   ((priorValidEmail ?? '') !== rawFormData['validEmail'])
  // );
  switch (priorNewsletterType ?? '') {
    case 'opted out':
      rawFormData['newsletterType'] = 'opted out';
      break;
    case 'email':
      if ((email ?? '') != (priorEmail ?? '')) {
        if ((email ?? '') === '') {
          if ((rawFormData['validPostMail'] ?? '') === 'valid') {
            rawFormData['newsletterType'] = 'post';
          } else {
            rawFormData['newsletterType'] = 'none';
          }
        }
      } else {
        rawFormData['newsletterType'] = 'email';
      }
      break;
    case 'post':
      if (isAddressChanged) {
        if (isAddressComplete) {
          rawFormData['newsletterType'] = 'post';
        } else if (['valid', 'unchecked'].includes(rawFormData.get('validEmail'))) {
          rawFormData['newsletterType'] = 'email';
        } else {
          rawFormData['newsletterType'] = 'none';
        }
      } else {
        rawFormData['newsletterType'] = 'post';
      }
      break;
    case 'none':
    case '':
      rawFormData['newsletterType'] = 'none';
      break;
  }

  const mmb = formData.get('mmb') ?? '';
  rawFormData['mmb'] = mmb !== '' ? mmb : 'VOL'

  rawFormData['isActive'] = formData.get('isActive') ?? true;

  console.log(`MemberDocumentActions updateMemberFormAction rawFormData: ${JSON.stringify(rawFormData)}`);

  const validatedFields = UpdateMemberDocument.safeParse(rawFormData);
  console.log(`MemberDocumentActions updateMemberFormAction validatedFields: ${JSON.stringify(validatedFields)}`);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Member.',
    };
  }


  try {
    updateMemberById(id, validatedFields.data);
  } catch (err: any) {
    console.error(`Database Error: Failed to Update Member: ${JSON.stringify(err)}`);
    return {
      message: 'Database Error: Failed to Update Member.',
    };
  }

  // Revalidate the cache for the members page and redirect the user.
  revalidatePath(MEMBERS_PAGE_PATH);
  redirect(MEMBERS_PAGE_PATH);

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
