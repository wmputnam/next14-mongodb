'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { createMemberRemittanceFormAction } from '@/Server/actions/MemberDocumentActions';
import { State } from '@/Server/actions/actions';
import { TextInput } from './inputs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MemberForm } from '@/app/lib/definitions';


export default function Form({
  member,
}: {
  member: MemberForm;
}) {

  console.log(`create remittance form memberId: "${member.id}"`)
  const initialState = { message: null, errors: {} };
  const [state, dispatch] =
    useFormState<State, FormData>(
      createMemberRemittanceFormAction,
      initialState);

  const FormAction = (formData: FormData) => {
    dispatch(formData);
  }
  console.log(`create remittance form memberId: "${member.id}"`);
  console.log(`create remittance form prior remittances: "${JSON.stringify(member.remittances) ?? '[]'}"`)

  return (
    <form action={FormAction}>
      {/* form boundary */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* member id */}
        <TextInput
          fieldName={"memberid"}
          defaultValue={member.id}
          state={state}
          type={'hidden'}
        />
        {/* mmb */}
        <TextInput
          fieldName={"mmb"}
          defaultValue={member.mmb}
          state={state}
          type={'hidden'}
        />
        {/* paid through date */}
        <TextInput
          fieldName={"paidthroughdate"}
          defaultValue={member.paidThrough}
          state={state}
          type={'hidden'}
        />
        {/* joined date */}
        <TextInput
          fieldName={"joined"}
          defaultValue={member.joined}
          state={state}
          type={'hidden'}
        />
        {/* prior remittances */}
        <TextInput
          fieldName={"priorremittances"}
          defaultValue={JSON.stringify(member.remittances) ?? '[]'}
          state={state}
          type={'hidden'}
        />
        {/* date */}
        <TextInput
          fieldName={"date"}
          type={'date'}
          label={'Date'} placeholder={'Please enter a date'}
          defaultValue={(new Date()).toISOString().substring(0, 10)}
          state={state}
          required={true}
        />
        {/* dues amount */}
        <TextInput
          fieldName={"duesamount"}
          label={'Dues remittance'} placeholder={'Please enter amount'}
          defaultValue="0.00"
          state={state}
          required={true}
          pattern={'[\\d]+\.[\\d]{2,2}'}
          hidden={['LM', 'BEN', 'HLM'].includes(member.mmb)}
        />
        {/* donation amount */}
        <TextInput
          fieldName={"donationamount"}
          label={'Donation remittance'} placeholder={'Please enter amount'}
          defaultValue="0.00"
          state={state}
          required={true}
          pattern={'[\\d,]+\.[\\d]{2,2}'}
        />
      </div>
      {/*  buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/members/${member.id}/remittances`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Remittance</Button>
      </div>
    </form >
  );
}
