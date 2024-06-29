'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { createMemberNoteFormAction } from '@/Server/actions/MemberDocumentActions';
import { State } from '@/Server/actions/actions';
import { TextInput } from './inputs';
import { MemberForm } from '@/app/lib/definitions';


export default function Form({
  member,
}: {
  member: MemberForm;
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] =
    useFormState<State, FormData>(
      createMemberNoteFormAction,
      initialState);

  const FormAction = (formData: FormData) => {
    dispatch(formData);
  }

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
        {/* prior notes */}
        <TextInput
          fieldName={"priornotes"}
          defaultValue={JSON.stringify(member.notes) ?? '[]'}
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
        {/* note */}
        <TextInput
          fieldName={"note"}
          label={'Note'}
          placeholder={'Please enter note'}
          defaultValue=""
          state={state}
          required={true}
        />
      </div>
      {/*  buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/members/${member.id}/notes`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Note</Button>
      </div>
    </form >
  );
}
