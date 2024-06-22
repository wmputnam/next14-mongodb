'use client';
// import {
//   CheckIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
//   UserCircleIcon,
// } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
// import { UpdateMemberDocument } from './buttons';
import { updateMemberFormAction } from '@/Server/actions/MemberDocumentActions';
import { State } from '@/Server/actions/actions';
import { IMemberForm } from '@/app/lib/definitions';
// import { IMemberForm } from '@/app/lib/MemberForm';

export default function Form({
  member,
}: {
  member: IMemberForm;
}) {
  console.log(`member edit form - member.id: "${member.id}"`)
  const initialState = { message: null, errors: {} };
  const updateMemberFormActionWithId = updateMemberFormAction.bind(null, member.id ? member.id : "");
  const [state, dispatch] = useFormState<State, FormData>(updateMemberFormActionWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* last name */}
        <div className="mb-4">
          <label htmlFor="last-name" className="mb-2 block text-sm font-medium">
            Last name:
          </label>
          <div className="relative">
            <input
              id="last-name"
              name="last-name"
              type="text"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={member.lastName}
              placeholder='last name'
              aria-describedby="last-name-error"
            >
            </input>
            {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
          </div>
          <div id="last-name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.lastName &&
              state.errors.lastName.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

        </div>

        {/* first name */}
        <div className="mb-4">
          <label htmlFor="first-name" className="mb-2 block text-sm font-medium">
            First name:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="first-name"
                name="first-name"
                type="text"
                defaultValue={member.firstName}
                placeholder="first name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="first-name-error"
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
            <div id="first-name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.firstName &&
                state.errors.firstName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/members"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Member</Button>
      </div>
    </form>
  );
}
