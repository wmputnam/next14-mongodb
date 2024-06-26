import Form from '@/app/ui/members/create-form';
import Breadcrumbs from '@/app/ui/members/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create member document',
};

export default async function Page() {
  // const customers = await fetchCustomers();

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
      <Form />
    </main>
  );
}