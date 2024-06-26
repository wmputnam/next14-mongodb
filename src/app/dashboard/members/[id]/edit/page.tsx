import Form from '@/app/ui/members/edit-form';
import Breadcrumbs from '@/app/ui/members/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchMemberById } from '@/Server/actions/MemberDocumentActions';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { MemberForm } from '@/app/lib/definitions';
import { transformIMemberDocumentToMemberForm } from '@/Client/lib/serverActions';

export const metadata: Metadata = {
  title: 'Invoice edit',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const [memberObj] = await Promise.all([
    fetchMemberById(id),
    // fetchCustomers(),
  ]);

  if (!memberObj) {
    notFound();
  }

  const memberForm = await transformIMemberDocumentToMemberForm(memberObj);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Members', href: '/dashboard/members' },
          {
            label: 'Edit Member',
            href: `/dashboard/members/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form member={memberForm} />
    </main>
  );
}

// function transformIMemberDocumentToMemberForm(memberObj: IMemberDocument) {
//   throw new Error('Function not implemented.');
// }
