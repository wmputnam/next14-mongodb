import Form from '@/app/ui/members/edit-form';
import Breadcrumbs from '@/app/ui/members/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchMemberById } from '@/Server/actions/MemberDocumentActions';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { MemberForm } from '@/app/lib/MemberForm';
// import { type IMemberForm } from '@/app/lib/definitions';
// import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
// import { MemberForm } from '@/app/lib/MemberForm';

export const metadata: Metadata = {
  title: 'Invoice edit',
};

const transformIMemberDocumentToMemberForm = (m: IMemberDocument) => {
  if (m._id) {
    const id = m._id.toString();
    return {
      id: id,
      lastName: m.lastName ? m.lastName : "",
      firstName: m.firstName ? m.firstName : "",
    } satisfies MemberForm
  } else {
    throw new Error('returned member document has no "_id"');
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  // console.log(`member edit page: id: ${params.id}`);

  const [memberObj] = await Promise.all([
    fetchMemberById(id),
    // fetchCustomers(),
  ]);

  if (!memberObj) {
    notFound();
  }

  const memberForm = transformIMemberDocumentToMemberForm(memberObj);

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