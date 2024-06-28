// import Image from 'next/image';
import { UpdateMemberDocument, DeleteMemberDocument } from '@/app/ui/members/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { fetchMemberById, fetchMembers } from '@/Server/actions/MemberDocumentActions';
import React from 'react';
import clsx from 'clsx';
import { notFound } from 'next/dist/client/components/not-found';

/**
 * @function Table
 * @description React component with member table and _RUD
 * @param memberId
 * @param projection -- mongodDB project for doc elements to return [{}]
 * @returns React.JSX table of member docs
 */
export async function Table({
  memberId = '',
  projection = {
    _id: 0,
    lastName: 1,
    firstName: 1,
    remittances: 1,
  }
}: {
  memberId?: string;
  projection?: Object;
}) {


  const memberDocument: IMemberDocument | undefined = await fetchMemberById(
    memberId,
    projection);

  const orderedRemits = memberDocument && memberDocument.remittances ?
    (memberDocument.remittances.map((remit) => ({ id: remit.id, date: remit.date, amount: remit.amount, memo: remit.memo })).sort((a, b) => a.date.valueOf() - b.date.valueOf()))
    : [];



  if (orderedRemits) {
    return (
      <div className="mt-1 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {orderedRemits.map((remit) => (
                <div
                  className="mb-2 w-full rounded-md bg-white p-4"
                  key={`md:hidden-${remit.id}`}
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{remit.date.toISOString().slice(0, 10)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="flex justify-end gap-2">
                      {/* <UpdateMemberDocument id={remit._id ? remit._id.toString() : ""} /> */}
                      {/* <DeleteMemberDocument id={remit._id ? remit._id.toString() : ""} /> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg bg-blue-100 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Memo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orderedRemits.map((remit) => (
                  <tr
                    className={clsx("w-full border-b py-2 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg border-slate-600")}
                    key={`tr-${remit.id}`}
                  >
                    <td className="whitespace-nowrap py-2 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{remit.date.toISOString().slice(0, 10)}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      {remit.memo}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      {`$ ${remit.amount}`}
                    </td>
                    <td className="whitespace-nowrap py-2 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {/* <UpdateMemberDocument id={member._id ? member._id.toString() : ""} /> */}
                        {/* <DeleteMemberDocument id={member._id ? member._id.toString() : ""} /> */}
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
  } else {
    notFound();
  }
}

export default Table;
