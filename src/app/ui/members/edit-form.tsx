'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { updateMemberFormAction } from '@/Server/actions/MemberDocumentActions';
import { State } from '@/Server/actions/actions';
import { MemberForm } from '@/app/lib/definitions';
import { DateInput, TextInput } from './inputs';

const fixValidPost = (p: string | boolean) => {
  if (typeof p === 'boolean') {
    return "valid"
  } else {
    return p;
  }
}

export default function Form({
  member,
}: {
  member: MemberForm;
}) {
  console.log(`member edit form - member.id: "${member.id}"`)
  const initialState = { message: null, errors: {} };
  const updateMemberFormActionWithId = updateMemberFormAction.bind(null, member.id ? member.id : "");
  const [state, dispatch] = useFormState<State, FormData>(updateMemberFormActionWithId, initialState);


  return (
    <form action={dispatch}>
      {/* form boundary */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <fieldset className="grid grid-cols-2" id="name">
          {false && <label
            id="name"
          >Name</label>}
          {/* first name */}
          <TextInput
            fieldName={"first-name"}
            label={'First name'}
            value={member.firstName}
            state={state}
          />
          {/* last name */}
          <TextInput
            fieldName={"last-name"}
            label={'Last name'}
            value={member.lastName}
            state={state}
          />

        </fieldset>
        <fieldset className="grid grid-cols-2" id="mailing-address">
          {false && <label>Address</label>}
          {/* address */}
          <div className="w">
            <TextInput
              fieldName={"address"}
              label={'Address'}
              value={member.address}
              state={state}
            />
          </div>
          {/* unit */}
          <TextInput
            fieldName={"unit"}
            label={'Unit'}
            value={member.unit}
            state={state}
          />
          {/* city */}
          <TextInput
            fieldName={"city"}
            label={'City'}
            value={member.city}
            state={state}
          />
          {/* state  */}
          {/* TODO -- drop down */}
          <TextInput
            label={'State'}
            fieldName={"State"}
            value={member.state}
            state={state}
          />
          {/* postalCode  */}
          {/* TODO -- magic */}
          <TextInput
            label={'Postal code'}
            fieldName={"postal-code"}
            value={member.postalCode}
            state={state}
          />
        </fieldset>
        <fieldset className='grid grid-cols-2'>
          {false && <label>
            Contact info
          </label>}
          {/* email  */}
          <TextInput
            fieldName={"email"}
            label={'Email'}
            value={member.email}
            state={state}
          />
          {/* phone  */}
          <TextInput
            fieldName={"phone"}
            label={'Phone'}
            value={member.phone}
            state={state}
          />
        </fieldset>
        <fieldset className='grid grid-cols-6'>
          {false && <label>
            Membership info
          </label>}
          {/* mmb  */}
          <TextInput
            fieldName={"mmb"}
            label={'MMB'}
            value={member.mmb}
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* paidThrough  */}
          {(member.paidThrough &&
            !['VOL', 'LM', 'HLM'].includes(member.mmb)) &&
            <DateInput
              fieldName={"paid-through"}
              label={'Paid through'}
              value={member.paidThrough}
              state={state}
              disabled={true}
              readOnly={true}
            />}
          {/* joined  */}
          {(member.joined &&
            !['VOL', 'HLM'].includes(member.mmb)
          ) &&
            <DateInput
              fieldName={"joined"}
              label={'Joined'}
              value={member.joined}
              state={state}
              disabled={true}
              readOnly={true}
            />}
          {/* newsletterType  */}
          <TextInput
            fieldName={"newsletter-type"}
            label={'Newsletter delivery'}
            value={member.newsLetterType}
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* valid email  */}
          <TextInput
            fieldName={"valid-email"}
            label={'Email status'}
            value={member.validEmail}
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* valid post mail  */}
          <TextInput
            fieldName={"valid-post-mail"}
            label={'Post status'}
            value={fixValidPost(member.validPostMail)}
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* lastUpdated  */}
          {member.lastUpdated &&
            <DateInput
              label={'Last updated'}
              fieldName={"last-updated"}
              value={member.lastUpdated}
              state={state}
              disabled={true}
              readOnly={true}
            />}

        </fieldset>
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

/*
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
                { <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />}
              </div >
  <div id="first-name-error" aria-live="polite" aria-atomic="true">
    {state.errors?.firstName &&
      state.errors.firstName.map((error: string) => (
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
  </div>
            </div >
          </div >
*/
