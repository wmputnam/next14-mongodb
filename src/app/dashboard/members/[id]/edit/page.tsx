import Form from '@/app/ui/members/edit-form';
import Breadcrumbs from '@/app/ui/members/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchMemberById } from '@/Server/actions/MemberDocumentActions';
import { IMemberDocument } from '@/Server/Service/MemberDocumentService';
import { MemberForm } from '@/app/lib/definitions';

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
      address: m.address ? m.address : "",
      unit: m.unit ? m.unit : "",
      city: m.city ? m.city : "",
      state: m.state ? m.state : "",
      postalCode: m.postalCode ? m.postalCode : "",
      email: m.email ? m.email : "",
      phone: m.phone ? m.phone : "",
      mmb: m.mmb ? (m.mmb.slice(0, 3) === 'BEN' ? 'LM' : m.mmb) : "",
      paidThrough: m.paidThrough ? m.paidThrough : undefined,
      joined: m.joined ? m.joined : undefined,
      newsletterType: m.newsletterType ? m.newsletterType : "",
      validEmail: m.validEmail ? m.validEmail : "",
      validPostMail: m.validPostMail ? m.validPostMail : "",
      lastUpdated: m.lastUpdated ? m.lastUpdated : undefined,
    } satisfies MemberForm
  } else {
    throw new Error('returned member document has no "_id"');
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

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