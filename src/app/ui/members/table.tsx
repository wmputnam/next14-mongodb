// import Image from 'next/image';
import { UpdateMemberDocument, DeleteMemberDocument, ViewMemberRemittances } from '@/app/ui/members/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { fetchMembers } from '@/Server/actions/MemberDocumentActions';
import React from 'react';
import clsx from 'clsx';

/**
 * @function MembersTable
 * @description React component with member table and _RUD
 * @param params
 * @param params.filter -- mongoDB filter [{isActive:true}]
 * @param params.currentPage <number> page set to display [1] 
 * @param params.limit <number> max docs per page  [10] 
 * @param params.projection -- mongodDB project for doc elements to return [{}]
 * @param params.sort -- sort order for table [{lastName:1,firstName:1}]
 * @param params.query -- string value to match in lastName
 * @returns React.JSX table of member docs
 */
export async function Table({
  filter = { isActive: true },
  currentPage = 1,
  limit = 10,
  projection = {
    _id: 1,
    lastName: 1,
    firstName: 1,
    email: 1,
    phone: 1,
    mmb: 1,
    paidThrough: 1,
  },
  sort = {
    lastName: 1,
    firstName: 1
  },
  query = '',
}: {
  filter?: any;
  currentPage?: number;
  limit?: number;
  projection?: Object;
  sort: any;
  query: string;
}) {

  let filterWithQuery;
  // add query to filter if given
  if (query === '') {
    filterWithQuery = filter;
  } else {
    filterWithQuery = {
      ...filter,
      $or: [
        { lastName: { $regex: `${query}`, $options: 'i' } },
        { firstName: { $regex: `${query}`, $options: 'i' } },
        { email: { $regex: `${query}`, $options: 'i' } },
      ]
    }
  }

  const memberDocuments = await fetchMembers(
    currentPage,
    limit,
    filterWithQuery,
    projection,
    sort);


  const transformName = (lastName: string, firstName: string) => {
    if (lastName && firstName) {
      return `${toProperNameCase(lastName)}, ${toProperNameCase(firstName)}`
    } else if (lastName) {
      return `${toProperNameCase(lastName)}`
    }
    return "";
  }

  const transformMmb = (mmb: string) => {
    if (mmb === 'BEN')
      return "LM"
    else
      return mmb;
  };

  const transformPaidThrough = (mmb: string | undefined, paidThroughDate: Date | undefined) => {
    if (mmb && !['LM', 'HLM', 'VOL', 'BEN'].includes(mmb)) {
      if (paidThroughDate instanceof Date) {
        return formatDateToLocal(paidThroughDate.toISOString());
      } else if (typeof paidThroughDate === 'string') {
        return formatDateToLocal(paidThroughDate);
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  const slicesGen = (wordIndices: number[], nonWordIndices: number[], length: number) => {
    const result = Array<{ t: 'WORD' | 'OTHER', s: number, e: number }>();
    if (length === 0) return result;

    const tokensA = Array<{ typ: 'WORD' | 'OTHER', offset: number }>();
    for (let i = 0; i < wordIndices.length; i++) {
      tokensA[wordIndices[i]] = { typ: 'WORD', offset: wordIndices[i] };
    }
    for (let i = 0; i < nonWordIndices.length; i++) {
      tokensA[nonWordIndices[i]] = { typ: 'OTHER', offset: nonWordIndices[i] }
    }

    const tokensB = tokensA.filter((item) => item !== undefined);

    let startIdx = 0;
    let endIdx: number = length;
    let type: 'WORD' | 'OTHER' = 'WORD'

    for (let i = 0; i < tokensB.length; i++) {
      if (tokensB[i].offset === 0) {
        type = tokensB[i].typ;
        continue;
      } else {
        endIdx = tokensB[i].offset
        result.push({ t: tokensB[i - 1].typ, s: startIdx, e: endIdx - 1 });
        startIdx = tokensB[i].offset;
        type = tokensB[i].typ;
      }
    }
    if (endIdx < length) {
      result.push({ t: type, s: startIdx, e: length - 1 });
    }
    return result;
  }

  const toProperNameCase = (s: string) => {
    const nonWordPat = /\W+/;
    const nonWordPatGlobal = /\W+/g;
    const wordPat = /\w+/;
    const wordPatGlobal = /\w+/g;
    const noCapWords = ['AND', 'OF', 'FAMILY'];

    if (!nonWordPat.test(s)) {
      return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
    } else {
      let result: string = '';
      let wordIndices = Array.from(s.matchAll(wordPatGlobal)).map(x => x.index);
      let nonWordIndices = Array.from(s.matchAll(nonWordPatGlobal)).map(x => x.index);
      const slices = slicesGen(wordIndices, nonWordIndices, s.length);
      for (let i = 0; i < slices.length; i++) {
        if (slices[i].t === 'WORD') {
          if (!noCapWords.includes(s.slice(slices[i].s, slices[i].e + 1))) {
            result += toProperNameCase(s.slice(slices[i].s, slices[i].e + 1));
          } else {
            result += s.slice(slices[i].s, slices[i].e + 1).toLowerCase();
          }
        } else {
          result += s.slice(slices[i].s, slices[i].e + 1);
        }
      }

      return result;
    }
  }

  const paidCurrentFontStyle = (mmb: string | undefined, paidThrough: Date | undefined) => {
    const now: Date = new Date(Date.now());
    if (mmb) {
      const today: Date = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
      if (!['LM', 'VOL', 'HLM', 'BEN'].includes(mmb) &&
        paidThrough &&
        paidThrough && paidThrough >= today
      ) {
        return ' text-green-700 font-bold';
      } else if (['LM', 'HLM', 'BEN'].includes(mmb)) {
        return ' text-green-700 font-bold';
      }
      return '';
    }
  }

  const isPaidCurrent = (mmb: string | undefined, paidThrough: Date | undefined) => {
    const alwaysPaidCurrentMmb = ['LM', 'HLM', 'BEN']
    const neverPaidCurrentMmb = ['VOL']
    const now: Date = new Date(Date.now());
    const today: Date = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    if (mmb) {
      switch (mmb) {
        case 'LM':
        case 'HLM':
        case 'BEN':
          return true;
        case 'VOL':
          return false;
        default:

          if (
            paidThrough &&
            paidThrough && paidThrough >= today
          ) {
            return true;
          } else {
            return false;
          }
      }
    }
    return false;
  }

  const toolTipDefaultForIndex = (s: string, n: number) => {
    return s + n;
  }

  const includeToolTip = (member: IMemberDocument) =>
    member.mmb !== undefined &&
    !['LM', 'VOL', 'HLM', 'BEN'].includes(member.mmb) &&
    member.paidThrough !== undefined;

  return (
    <div className="mt-1 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {memberDocuments?.data.map((member) => (
              <div
                className="mb-2 w-full rounded-md bg-white p-4"
                key={"md:hidden" + member._id?.toString()}
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{transformName(member.lastName, member.firstName)}</p>
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateMemberDocument id={member._id ? member._id.toString() : ""} />
                    <DeleteMemberDocument id={member._id ? member._id.toString() : ""} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg bg-blue-100 text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Member Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  MMB
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {memberDocuments?.data.map((member, index) => (
                <tr
                  className={clsx("w-full border-b py-2 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg border-slate-600", isPaidCurrent(member.mmb, member.paidThrough) && "bg-green-200")}
                  key={"tr-" + member._id?.toString()}
                >
                  <td className="whitespace-nowrap py-2 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src={member.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${member.name}'s profile picture`}
                      /> */}
                      <p>{transformName(member.lastName, member.firstName)}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {member.email?.toLowerCase()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {member.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 has-tooltip" data-tooltip-target={toolTipDefaultForIndex("tooltip-default-", index)} data-tooltip-trigger="hover">
                    {member.mmb && transformMmb(member.mmb)}
                    <div id={toolTipDefaultForIndex("tooltip-default-", index)} role="tooltip" className={clsx("tooltip text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm", includeToolTip(member) && "px-3 py-2")}>
                      {/*  absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 dark:bg-gray-700 */}
                      {
                        includeToolTip(member) ? `paid through ${transformPaidThrough(member.mmb, member.paidThrough)}` : ''}
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-2 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateMemberDocument id={member._id ? member._id.toString() : ""} />
                      <ViewMemberRemittances id={member._id ? member._id.toString() : ""} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
