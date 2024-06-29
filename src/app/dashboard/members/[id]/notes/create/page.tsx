import Form from '@/app/ui/note/create-form';
import Breadcrumbs from '@/app/ui/note/breadcrumbs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchMemberById } from '@/Server/actions/MemberDocumentActions';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { MemberForm } from '@/app/lib/definitions';
import { transformIMemberDocumentToMemberForm } from '@/Client/lib/serverActions';


export const metadata: Metadata = {
  title: 'Add member note',
};

export default async function Page({ params }: { params: { id: string } }) {
  const memberId = params.id;

  const memberObj = await fetchMemberById(memberId);

  if (!memberObj) {
    notFound();
  }

  const memberForm: MemberForm = await transformIMemberDocumentToMemberForm(memberObj);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Members', href: '/dashboard/members' },
          {
            label: 'Create Member Note',
            href: `/dashboard/members/${memberId}/notes/create`,
            active: true,
          },
        ]}
      />
      <Form member={memberForm} />
    </main>
  );
}


