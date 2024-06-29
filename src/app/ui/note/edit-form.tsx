'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { updateMemberNoteFormAction } from '@/Server/actions/MemberDocumentActions';
import { State } from '@/Server/actions/actions';
import { MemberForm, Note } from '@/app/lib/definitions';
import { DateInput, TextInput } from './inputs';

const fixValidPost = (p: string | boolean) => {
  if (typeof p === 'boolean') {
    return "valid"
  } else {
    return p;
  }
}

export default function Form({
  memberId,
  noteId,
  notes,
}: {
  memberId: string;
  noteId: string;
  notes: Note[];
}) {

  const initialState = { message: null, errors: {} };
  const updateMemberFormActionWithId = updateMemberNoteFormAction.bind(null, memberId);
  const [state, dispatch] = useFormState<State, FormData>(updateMemberFormActionWithId, initialState);
  
  if (memberId && noteId && notes) {
  let noteDateString: string;
  let noteNote: string;
  let noteDate: Date;
  let noteBody: string;

  const noteData = notes.filter((n: Note) => (n.id === noteId))[0];
  noteDate = noteData.date;
  noteBody = noteData.note;


  return (
    <form action={dispatch}>
      {/* form boundary */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* id  HIDDEN */}
        <TextInput
          fieldName={"id"}
          defaultValue={memberId}
          state={state}
          hidden={true}
        />
        {/* note id HIDDEN */}
        <TextInput
          fieldName={"noteid"}
          defaultValue={noteId}
          state={state}
          hidden={true}
        />
        {/* notes array HIDDEN */}
        <TextInput
          fieldName={"notes"}
          defaultValue={JSON.stringify(notes)}
          state={state}
          hidden={true}
        />
        {/* date */}
        <TextInput
          fieldName={"date"}
          label={'Date'}
          placeholder={'Date'}
          type={'date'}
          defaultValue={noteDate}
          state={state}
        />
        {/* note */}
        <TextInput
          fieldName={"note"}
          label={'Note'}
          placeholder={'Note'}
          defaultValue={noteBody}
          state={state}
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/members/${memberId}/notes`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Back
        </Link>
        <Button type="submit">Update Note</Button>
      </div>
    </form>
  );
}
}
