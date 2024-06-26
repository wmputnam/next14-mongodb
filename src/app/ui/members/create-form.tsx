'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { createMemberFormAction } from '@/Server/actions/MemberDocumentActions';
import { State } from '@/Server/actions/actions';
import { DateInput, TextInput } from './inputs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export default function Form({
}: {
  }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<State, FormData>(createMemberFormAction, initialState);

  const FormAction = (formData: FormData) => {
    dispatch(formData);

  }

  return (
    <form action={FormAction}>
      {/* form boundary */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <fieldset className="grid grid-cols-2" id="name">
          {false && <label
            id="name"
          >Name</label>}
          {/* first name */}
          <TextInput
            fieldName={"fname"}
            label={'First name'} placeholder={'First name'}
            defaultValue=""
            state={state}
            required={true}
          />
          {/* last name */}
          <TextInput
            fieldName={"lname"}
            label={'Last name'} placeholder={'Last name'}
            defaultValue=""
            state={state}
            required={true}
          />

        </fieldset>
        <fieldset className="grid grid-cols-2" id="mailing-address">
          {false && <label>Address</label>}
          {/* address */}
          <div>
            <TextInput
              fieldName={"address"}
              label={'Address'} placeholder={'Address'}
              defaultValue=""
              state={state}
            />
          </div>
          {/* unit */}
          <TextInput
            fieldName={"unit"}
            label={'Unit'} placeholder={'Unit'}
            defaultValue=""
            state={state}
          />
          {/* city */}
          <TextInput
            fieldName={"city"}
            label={'City'} placeholder={'City'}
            defaultValue=""
            state={state}
          />
          {/* state  */}
          {/* TODO -- drop down */}
          <TextInput
            fieldName={"state"}
            label={'State'}
            placeholder={'State'}
            defaultValue=""
            state={state}
          />
          {/* postalCode  */}
          {/* TODO -- magic */}
          <TextInput
            fieldName={"postalcode"}
            label={'Postal code'}
            placeholder={'Postal code'}
            defaultValue=""
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
            label={'Email'} placeholder={'Email'}
            defaultValue=""
            state={state}
          />
          {/* phone  */}
          <TextInput
            fieldName={"phone"}
            label={'Phone'} placeholder={'Phone'}
            defaultValue=""
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
            label={'MMB'} placeholder={'MMB'}
            defaultValue=""
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* paidThrough  */}
          {
            <DateInput
              fieldName={"paid-through"}
              label={'Paid through'} placeholder={'Paid through'}
              defaultValue=""
              state={state}
              disabled={true}
              readOnly={true}
            />}
          {/* joined  */}
          {
            <DateInput
              fieldName={"joined"}
              label={'Joined'} placeholder={'Joined'}
              defaultValue=""
              state={state}
              disabled={true}
              readOnly={true}
            />}
          {/* newsletterType  */}
          <TextInput
            fieldName={"newsletter-type"}
            label={'Newsletter delivery'} placeholder={'Newsletter delivery'}
            defaultValue=""
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* valid email  */}
          <TextInput
            fieldName={"valid-email"}
            label={'Email status'} placeholder={'Email status'}
            defaultValue=""
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* valid post mail  */}
          <TextInput
            fieldName={"valid-post-mail"}
            label={'Post status'} placeholder={'Post status'}
            defaultValue=""
            state={state}
            disabled={true}
            readOnly={true}
          />
          {/* lastUpdated  */}
          {
            <DateInput
              label={'Last updated'} placeholder={'Last updated'}
              fieldName={"last-updated"}
              defaultValue=""
              state={state}
              disabled={true}
              readOnly={true}
            />}

        </fieldset>
      </div>
      {/*  buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/members"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Member</Button>
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
