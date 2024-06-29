import Form from '@/app/ui/note/edit-form';
import Breadcrumbs from '@/app/ui/members/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
import { MemberForm, Note } from '@/app/lib/definitions';
import { INotes } from '@/Server/Service/MemberDocumentService/INotes';
import { headers } from 'next/headers';
import { fetchMemberById } from '@/Server/actions/MemberDocumentActions';

export const metadata: Metadata = {
  title: 'Edit member note',
};

export default async function Page({
  pageParams,
}: {
  pageParams?: {
    memberId?: string;
    noteId?: string;
    notes?: INotes[];
  };
}) {

  let memberId: string | undefined = undefined;
  let noteId: string | undefined = undefined;
  if (pageParams && pageParams.memberId) {
    memberId = pageParams.memberId;
  }
  if (pageParams && pageParams.noteId) {
    noteId = pageParams.noteId;
  }
  if (!memberId || !noteId) {
    const rePat = /(^.*members\/)([\d\w]+)(\/notes\/)([\d\w]+)(\/edit)/;
    const headerList = headers();
    const pathName = headerList.get("x-current-path") ?? '';
    const patMatches = rePat.exec(pathName);
    if (patMatches !== null) {
      memberId = patMatches[2];
      noteId = patMatches[4];
    }
  }
  const [memberObj] = await Promise.all([
    fetchMemberById(memberId as string)
  ]);

  // hydrate notes
  if (memberObj && memberObj.notes) {

    const notesRaw: INotes[] = memberObj.notes;
    const notesData: Note[] = notesRaw.map((n) => (
      {
        id: n.id,
        date: new Date(n.date),
        note: n.note,
      }
    ));


    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Members', href: '/dashboard/members' },
            {
              label: 'Create Member document',
              href: '/dashboard/members/create',
              active: true,
            },
          ]}
        />
        <Form memberId={memberId as string} noteId={noteId as string} notes={notesData} />
      </main>
    );
  }


}