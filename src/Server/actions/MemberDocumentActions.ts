'use server';
import { z } from 'zod';
import { IMemberDocument, IRemittance } from "../Service/MemberDocumentService";
import { MemberDocumentService } from "../Service/MemberDocumentService/MemberDocumentService";
import { State } from "./actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MemberForm, Remittance } from '@/app/lib/definitions';
import { membershipDuesMmb } from '@/Client/lib/membershipDues';
import { ObjectId } from 'mongodb';

// import { UpdateMemberDocument } from '@/app/ui/members/buttons';

const RemittanceSchema = z.object({
  id: z.string(), // an ObjectId in the mongo db
  date: z.date(),
  amount: z.string(),
  memo: z.string(),
})

const FormSchema = z.object({
  id: z.string(), // an ObjectId in the mongo db
  lastName: z.string(),
  firstName: z.string(),
  address: z.string().optional(),
  unit: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  mmb: z.string(),
  paidThrough: z.date().optional(),
  joined: z.date().optional(),
  isActive: z.boolean(),
  validPostMail: z.enum(['valid', 'none', 'returned mail']),
  validEmail: z.enum(['none', 'verified', 'bounced', 'unchecked']),
  newsletterType: z.enum(['email', 'none', 'post', 'opted out']),
  remittances: z.array(RemittanceSchema).optional(),
  lastUpdated: z.date(),
});

const CreateMemberDocument = FormSchema.omit({
  id: true,
  lastUpdated: true,
});

const UpdateMemberDocument = FormSchema.omit({
  id: true,
  lastUpdated: true
});

const CreateMemberRemittance = FormSchema.pick({
  mmb: true,
  joined: true,
  paidThrough: true,
  remittances: true,
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

const MEMBERS_PAGE_PATH = () => `/dashboard/members`;
const MEMBER_REMITS_PAGE_PATH = (id:string) => `/dashboard/members/${id}/remittances`;

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
    rawFormData['address'] = streetAddress
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
  rawFormData['mmb'] = 'VOL';

  // isActive
  rawFormData['isActive'] = true;

  // *** finally, check the form data for missing or incorrect values
  const validatedFields = CreateMemberDocument.safeParse(rawFormData);

  // *** If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(`Missing Fields. Failed to Create Member document: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
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
  revalidatePath(MEMBERS_PAGE_PATH());

  // *** And redirect to the new URL
  redirect(MEMBERS_PAGE_PATH());
}


/**
 * @server @async @function fetchMemberById(memberDocId: string) 
 * @param documentId
 * @param projection -- document properties to return ({} is everything)
 * @returns Promise<Partial<IMember>>
 */
export const fetchMemberById = async (documentId: string, projection: any = {}) => {
  const memberDocumentService = new MemberDocumentService();
  return await memberDocumentService.fetchMemberDocumentById(documentId, projection);
}

/**
 @server @async @function updateMemberById(memberDocId:string) 
 * @param filter -- mongodb filter to select memeber document (typically document _id)
 * @param data -- mongodb update document (set/unset)
 * @returns Promise<IMember>
 */
export const updateMemberById = async (documentId: string, data: Partial<IMemberDocument>) => {
  if (documentId) {
    const memberDocumentService = new MemberDocumentService();
    return await memberDocumentService.updateMemberDocument(documentId, data);
  } else {
    throw new Error(`missing document id`);
  }
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
    rawFormData['address'] = streetAddress
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
      default:
        rawFormData['validPostMail'] = priorValidPostMail;
    }
  } else {
    rawFormData['validPostMail'] = 'none';
  }

  // validEmail
  // *** did this email data change?
  // *** how does that change impact the validEmail?
  const priorEmail = formData.get('prioremail');

  //< console.log(`updateMemberFormAction email:${email}`);
  //< console.log(`updateMemberFormAction prioremail:${formData.get('prioremail')}`);

  if ((email ?? '') === '') {
    rawFormData['validEmail'] = 'none';
  } else {
    const priorValidEmail = formData.get('priorvalidemail');

    const isEmailChanged = (
      ((email ?? '') !== (priorEmail ?? ''))
    );

    //< console.log(`updateMemberFormAction priorValidEmail:${priorValidEmail}`);
    //< console.log(`updateMemberFormAction isEmailChanged:${isEmailChanged}`);

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

  //? remittances? TODO

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
  revalidatePath(MEMBERS_PAGE_PATH());
  redirect(MEMBERS_PAGE_PATH());

}

export async function createMemberRemittanceFormAction(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const memberId = (formData.get('memberid') ?? '') as string;

  const mmb = (formData.get('mmb') ?? '') as string;

  const joinedString = (formData.get('joined') ?? '') as string;

  let joined: Date | undefined;
  if (joinedString && joinedString !== '') {
    joined = new Date(joinedString);
  } else {
    joined = undefined;
  }

  const paidThroughDateString = (formData.get('paidthroughdate') ?? '') as string;
  let paidThroughDate: Date | undefined;
  if (paidThroughDateString && paidThroughDateString !== '') {
    paidThroughDate = new Date(paidThroughDateString);
  } else {
    paidThroughDate = undefined;
  }

  //< console.log(`createMemberRemittanceFormAction memberid: "${memberId}"`);

  const rawRemittances = Array<Remittance>();

  // *** load in prior remittances
  const priorRemittancesAsJSON = formData.get('priorremittances');
  const priorRemittancesRaw: Remittance[] = JSON.parse(priorRemittancesAsJSON as string);
  for (let i = 0; i < priorRemittancesRaw.length; i++) {
    const rr = {
      id: priorRemittancesRaw[i].id,
      date: new Date(priorRemittancesRaw[i].date),
      amount: priorRemittancesRaw[i].amount,
      memo: priorRemittancesRaw[i].memo,
    };
    rawRemittances.push(rr);
  }

  console.log(`createMemberRemittanceFormAction rawRemittances prior: ${JSON.stringify(rawRemittances)}`);

  // *** get the editable field data from the form
  // remittance date
  const remittanceDateString: string = (formData.get('date') ?? '') as string;
  if (remittanceDateString !== '') {
    let remittanceDate: Date;
    try {
      remittanceDate = new Date(`${remittanceDateString.slice(0, 10)}T00:00:00`);
    } catch (err: any) {
      throw new Error(`unable to parse Date ${remittanceDateString}`);
    }

    // dues amount
    const duesAmount: string = (formData.get('duesamount') ?? '') as string;
    // console.log(`createMemberRemittanceFormAction dues amout: ${duesAmount}`)
    if (duesAmount !== '' && duesAmount !== '0.00') {
      rawRemittances.push({
        id: new ObjectId().toString(),
        date: remittanceDate ?? '',
        amount: duesAmount,
        memo: 'dues',
      })
    }

    // donation amount
    const donationAmount: string = (formData.get('donationamount') ?? '') as string;
    if (donationAmount !== '' && donationAmount !== '0.00') {
      rawRemittances.push({
        id: new ObjectId().toString(),
        date: remittanceDate ?? '',
        amount: donationAmount,
        memo: 'donation',
      })
    }

    const partialMemDoc: Partial<IMemberDocument> = { remittances: rawRemittances }
    const ONE_DAY_IN_MILLISECONDS = 86400000;

    // what impact, if any on mmb, joined, paidThrough
    // mmb VOL: joined may or may not have value, paidthough should be undefined
    //   dues => mmb: as appropriate to dues amount, joined: remittance date, paidThough: 1 year after remittance date
    //   donation => no effect on mmb, joined, or paidThrough
    // mmb LM|HLM|BEN: joined should have value, paidthrough should be undefined (always paid up)
    //   hide dues
    //   donation=> no effect on mmb, joined, or paidThrough
    // mmb all others: joined should have value, paidthrough should have value
    //   dues => mmb: as appropriate to dues amount, joined: remittance date, paidThough: 1 year after remittance date
    //   donation => no effect on mmb, joined, or paidThrough
    switch (mmb) {
      case 'LM':
      case 'HLM':
      case 'BEN':
        partialMemDoc['mmb'] = mmb;
        break;
      case 'VOL': {
        const newMmb = membershipDuesMmb(duesAmount);
        if (newMmb !== 'VOL') {
          partialMemDoc['joined'] = remittanceDate;
          partialMemDoc['paidThrough'] = dateForEndOfYearSpan(remittanceDate);
          partialMemDoc['mmb'] = `${newMmb}${!['LM'].includes(newMmb) ? partialMemDoc['paidThrough'].toISOString().slice(2, 4) : ''}`;
        } else {
          partialMemDoc['mmb'] = newMmb;
        }
        break;
      }
      default: {
        const newMmb = membershipDuesMmb(duesAmount);
        if (newMmb !== 'VOL') {
          partialMemDoc['joined'] = joined;
          if (paidThroughDate && remittanceDate.valueOf() <= paidThroughDate?.valueOf()) {
            partialMemDoc['paidThrough'] = dateForEndOfYearSpan(new Date(paidThroughDate.valueOf() + ONE_DAY_IN_MILLISECONDS));
          } else {
            partialMemDoc['paidThrough'] = dateForEndOfYearSpan(remittanceDate);
          }
          partialMemDoc['mmb'] = `${newMmb}${!['LM'].includes(newMmb) ? partialMemDoc['paidThrough'].toISOString().slice(2, 4) : ''}`;
        } else {
          partialMemDoc['mmb'] = newMmb;
        }
        break;
      }
    }

    console.log(`createMemberRemittanceFormAction partialMemDoc: ${JSON.stringify(partialMemDoc)}`);

    const validatedFields = CreateMemberRemittance.safeParse(partialMemDoc);
    console.log(`createMemberRemittanceFormAction validatedFields: ${JSON.stringify(validatedFields)}`);

    if (!validatedFields.success) {
      // If form validation fails, return errors early. Otherwise, continue.
      return {
        // errors: validatedFields?.error?.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Member.',
      };
    }
    try {
      updateMemberById(memberId, validatedFields.data as unknown as Partial<IMemberDocument>);
    } catch (err: any) {
      console.error(`Database Error: Failed to Update Member: ${JSON.stringify(err)}`);
      return {
        message: 'Database Error: Failed to Update Member.',
      };
    }

    // Revalidate the cache for the members page and redirect the user.
    revalidatePath(MEMBER_REMITS_PAGE_PATH(memberId));
    redirect(MEMBER_REMITS_PAGE_PATH(memberId));
  }
  return {} as State;
}

const dateForEndOfYearSpan = (d: Date): Date => {
  const givenDate = d.getDate();
  const givenMonth = d.getMonth();
  console.log(`given: ${givenMonth} ${givenDate}`)

  /* y = givenYear + 1 */

  const nextYear = d.getFullYear() + 1;
  let nextDate;
  let nextMonth;

  if (d.getDate() === 0) {
    if (d.getMonth() === 0) {
      /* Jan 1 => Dev 31 :=> m = 12, d = 31*/
      nextMonth = 12;
      nextDate = 31;
    } else {
      /* 1st of month not Jan: m = givenMonth - 1; d = last day of month */
      nextMonth = givenMonth - 1;
      nextDate = lastDayOf(givenMonth, nextYear);
    }
  } else {
    /* m = givenMonth; d = givenDay - 1; */
    nextMonth = givenMonth;
    nextDate = givenDate - 1;
  }
  return new Date(nextYear, nextMonth, nextDate);
}

const lastDayOf = (month: number, year: number) => {
  switch (month) {
    case 0: // Jan
      return 31;
    case 1: // Feb
      if (year % 4 === 0 && year % 100 !== 0) {
        // leap year
        return 29;
      } else {
        return 28;
      }
    case 2: // Mar
      return 31;
    case 3: // Apr
      return 30;
    case 4: // May
      return 31;
    case 5: // Jun
      return 30;
    case 6: // Jul
      return 31;
    case 7: // Aug
      return 30;
    case 8: // Sep
      return 31;
    case 9: // Oct
      return 31;
    case 10: // Nov
      return 30;
    case 11: // Dec
      return 31;

    default:
      throw new Error(`month must be between 0 and 11`)
  }
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

// export async function createMemberRemittanceFormAction(
//   prevState: State,
//   formData: FormData,
// ): Promise<State> {
//   return (
//     {}
//   );
// }

export const sTransformIMemberDocumentToMemberForm = async (m: IMemberDocument) => {
  if (m._id) {
    // IMember _id is a mongo ObejctId
    const id = m._id.toString();

    // hydrate remittances before creating the from data
    const remittances = m.remittances ?
      (
        m.remittances.map((r: IRemittance) => (
          {
            // id is a mongo ObjectId
            id: r.id.toString(),
            date: r.date,
            amount: r.amount,
            memo: r.memo
          }
        ))
      ) :
      (
        Array<Remittance>()
      );

    const mform = {
      id: id,
      lastName: m.lastName ? m.lastName : "",
      firstName: m.firstName ? m.firstName : "",
      address: m.address ? m.address : "",
      unit: m.unit ? m.unit : "",
      city: m.city ? m.city : "",
      state: m.state ? m.state : "",
      postalCode: m.postalCode ? m.postalCode : "",
      email: m.email ? m.email : "",
      phone: m.phone ? m.phone : "",
      mmb: m.mmb ? (m.mmb.slice(0, 3) === 'BEN' ? 'LM' : m.mmb) : "",
      paidThrough: m.paidThrough ? m.paidThrough : undefined,
      joined: m.joined ? m.joined : undefined,
      newsletterType: m.newsletterType ? m.newsletterType : "",
      validEmail: m.validEmail ? m.validEmail : "",
      validPostMail: m.validPostMail ? m.validPostMail : "",
      remittances: remittances,
      lastUpdated: m.lastUpdated ? m.lastUpdated : undefined,
    } satisfies MemberForm;
    return JSON.stringify(mform);
  } else {
    throw new Error('returned member document has no "_id"');
  }
}
