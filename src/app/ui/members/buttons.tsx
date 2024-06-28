import { deleteMemberById } from '@/Server/actions/MemberDocumentActions';
import { PencilIcon, PlusIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
// import { deleteInvoice } from '@/app/lib/actions';

export function CreateMemberDocument() {
  return (
    <Link
      href="/dashboard/members/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Member</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMemberDocument
  ({ id }: { id: string }) {

  return (
    <Link
      href={`/dashboard/members/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
      title='Update member'
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteMemberDocument
  ({ id }: { id: string }) {
  const deleteMemberWithId = deleteMemberById.bind(null, id);
  return (
    <>
      <form action={deleteMemberWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}

export function CreateMemberRemittance
  ({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/members/${id}/remittances/create`}
      className="flex items-center align-middle rounded-lg border h-10 px-4 text-sm font-medium bg-gray-100  transition-colors hover:bg-gray-200 text-gray-600"
    >
      {/* flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200*/}
      <span className="hidden md:block">Add remittance</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewMemberRemittances
  ({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/members/${id}/remittances/`}
      className="rounded-md border p-2 hover:bg-gray-100"
      title='View member remittances'
    >
      <CurrencyDollarIcon className="w-5" />
    </Link>
  );
}

export function ViewMembers
  ({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/members/`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <CurrencyDollarIcon className="w-5" />
    </Link>
  );
}