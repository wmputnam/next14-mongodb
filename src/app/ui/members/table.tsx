// import Image from 'next/image';
import { UpdateMemberDocument, DeleteMemberDocument } from '@/app/ui/members/buttons';
// import InvoiceStatus from '@/app/ui/members/status';
import { formatDateToLocal } from '@/app/lib/utils';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { fetchMembers } from '@/Server/actions/MemberDocumentActions';
import React from 'react';

/**
 * @function MembersTable
 * @description React component with member table and _RUD
 * @param params
 * @param params.query -- mongoDB filter [{isActive:true}]
 * @param params.currentPage <number> page set to display [1] 
 * @param params.limit <number> max docs per page  [10] 
 * @param params.projection -- mongodDB project for doc elements to return [{}]
 * @returns React.JSX table of member docs
 */
export async function MembersTable({
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
  }
}: {
  filter?: Partial<IMemberDocument>;
  currentPage?: number;
  limit?: number;
  projection?: Object;
  sort: any;
}) {

  const memberDocuments = await fetchMembers(
    currentPage,
    limit,
    filter,
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

  const transformPaidThrough = (mmb: string, paidThroughDate: Date) => {
    if (!['LM', 'HLM', 'VOL', 'BEN'].includes(mmb)) {
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
    // console.log(`tokensA: ${JSON.stringify(tokensA)}`)

    const tokensB = tokensA.filter((item) => item !== undefined);
    // console.log(`tokensB: ${JSON.stringify(tokensB)}`)

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
    // let startIdx:number = 0;// = Math.min(wordIndices[0], nonWordIndices[0]);
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
      // console.log(`"${s}" contains non-word characters`);
      let wordIndices = Array.from(s.matchAll(wordPatGlobal)).map(x => x.index);
      let nonWordIndices = Array.from(s.matchAll(nonWordPatGlobal)).map(x => x.index);
      // console.log(`wordIndices: ${wordIndices}`);
      // console.log(`nonWordIndices: ${nonWordIndices}`);
      // console.log(`length: ${s.length}`)
      const slices = slicesGen(wordIndices, nonWordIndices, s.length);
      // console.log(`slices: ${JSON.stringify(slices)}`);
      for (let i = 0; i < slices.length; i++) {
        if (slices[i].t === 'WORD') {
          if (!noCapWords.includes(s.slice(slices[i].s, slices[i].e + 1))) {
            // console.log(`${i}: ${toProperNameCase(s.slice(slices[i].s, slices[i].e + 1))}`);
            result += toProperNameCase(s.slice(slices[i].s, slices[i].e + 1));
          } else {
            // console.log(`${i}: ${toProperNameCase(s.slice(slices[i].s, slices[i].e + 1))}`);
            result += s.slice(slices[i].s, slices[i].e + 1).toLowerCase();
          }
        } else {
          // console.log(`${i}: ${s.slice(slices[i].s, slices[i].e + 1)}`);
          result += s.slice(slices[i].s, slices[i].e + 1);
        }
      }

      return result;
    }
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {memberDocuments?.data.map((member) => (
              <div
                className="mb-2 w-full rounded-md bg-white p-4"
                key={"md:hidden" + member._id}
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
            <thead className="rounded-lg text-left text-sm font-normal">
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
                <th scope="col" className="px-3 py-5 font-medium">
                  Paid Through
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {memberDocuments?.data.map((member) => (
                <tr
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  key={"tr-" + member._id}
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
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
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.mmb && transformMmb(member.mmb)}
                    {/* <InvoiceStatus status={member.mmb} /> */}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {
                      member.mmb && member.paidThrough && transformPaidThrough(member.mmb, member.paidThrough)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateMemberDocument id={member._id ? member._id.toString() : ""} />
                      <DeleteMemberDocument id={member._id ? member._id.toString() : ""} />
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

export default MembersTable;
