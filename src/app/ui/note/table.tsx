// import Image from 'next/image';
import { UpdateMemberDocument, DeleteMemberDocument, UpdateMemberNote } from '@/app/ui/members/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { IMemberDocument, INotes } from '@/Server/Service/MemberDocumentService';
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
    notes: 1,
  }
}: {
  memberId?: string;
  projection?: Object;
}) {

  function sortNotes(a: INotes, b: INotes) {
    if (a.date.valueOf() === b.date.valueOf()) {
      return a.id > b.id ? 1 : -1;
    } else {
      return a.date.valueOf() - b.date.valueOf()
    }

  }

  const memberDocument: IMemberDocument | undefined = await fetchMemberById(
    memberId,
    projection);

  const orderedNotes = memberDocument && memberDocument.notes ?
    (memberDocument.notes.map((note) => ({ id: note.id, date: note.date, note: note.note }))
      .sort(sortNotes))
    : [];



  if (orderedNotes) {
    return (
      <div className="mt-1 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {orderedNotes.map((note) => (
                <div
                  className="mb-2 w-full rounded-md bg-white p-4"
                  key={`md:hidden-${note.id}`}
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{note.date.toISOString().slice(0, 10)}</p>
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
            <table className="min-w-full text-gray-900 md:table table-auto">
              <thead className="rounded-lg bg-blue-100 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orderedNotes.map((note) => (
                  <tr
                    className={clsx("w-40 border-b py-2 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg border-slate-600")}
                    key={`tr-${note.id}`}
                  >
                    <td className="whitespace-nowrap py-2 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{note.date.toISOString().slice(0, 10)}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 min-w-3.5 max-w-72  text-wrap">
                      {note.note}
                    </td>
                    <td className="whitespace-nowrap py-2 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateMemberNote memberId={memberId} noteId={note.id} notes={memberDocument?.notes??[]} />
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
