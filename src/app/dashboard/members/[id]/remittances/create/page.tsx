import Form from '@/app/ui/remittance/create-form';
import Breadcrumbs from '@/app/ui/remittance/breadcrumbs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchMemberById } from '@/Server/actions/MemberDocumentActions';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { MemberForm } from '@/app/lib/definitions';
import { transformIMemberDocumentToMemberForm } from '@/Client/lib/serverActions';


export const metadata: Metadata = {
  title: 'Record member remittance',
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
            label: 'Create Member Remittance',
            href: `/dashboard/members/${memberId}/edit`,
            active: true,
          },
        ]}
      />
      <Form member={memberForm} />
    </main>
  );
}


