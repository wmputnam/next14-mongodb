// import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/members/buttons';
// import InvoiceStatus from '@/app/ui/members/status';
import { formatDateToLocal } from '@/app/lib/utils';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { MemberDocumentService } from '@/Server/Service/MemberDocumentService/MemberDocumentService';
import { fetchMembers } from '@/Server/actions/MemberDocumentActions';
import React from 'react';

/**
 * @function MembersTable
 * @description React component with me
 */
/**
 * 
 * @param params
 * @param params.query -- mongoDB filter [{isActive:true}]
 * @param params.currentPage <number> page set to display [1] 
 * @param params.limit <number> max docs per page  [10] 
 * @param params.projection -- mongodDB project for doc elements to return [{}]
 * @returns React.JSX table of member docs
 */
export async function MembersTable({
  query = { isActive: true },
  currentPage = 1,
  limit = 10,
  projection = {},
}: {
  query?: Partial<IMemberDocument>;
  currentPage?: number;
  limit?: number;
  projection?: Object;
}) {
  const memberDocumentService = new MemberDocumentService();
  const memberDocuments = await fetchMembers(
    currentPage,
    limit,
    { isActive: true },
    projection,
    { lastName: 1, firstName: 1 });

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
    // formatDateToLocal(member.paidThrough.toISOString())}
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
                      {/* <Image
                        src={member.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${member.name}'s profile picture`}
                      /> */}
                      <p>{member.lastName}, {member.firstName}</p>
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  {/* <InvoiceStatus status={member.status} /> */}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  {/* <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(member.amount)}
                    </p>
                    <p>{formatDateToLocal(member.date)}</p>
                  </div> */}
                  <div className="flex justify-end gap-2">
                    {/* <UpdateInvoice id={member._id} />
                    <DeleteInvoice id={member._id} /> */}
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
                      <p>{member.lastName}, {member.firstName}</p>
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
                      {/* <UpdateInvoice id={member.id} /> */}
                      {/* <DeleteInvoice id={member.id} /> */}
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
