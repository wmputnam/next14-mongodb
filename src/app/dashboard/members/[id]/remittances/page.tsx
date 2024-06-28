import React, { Suspense } from 'react';
// import { fetchMembersPageCount } from '@/Server/actions/MemberDocumentActions';
import { Table } from '@/app//ui/remittance/table';
// import { Pagination } from '@/app//ui/members/pagination';
import { CreateMemberDocument, CreateMemberRemittance } from '@/app/ui/members/buttons';
import Search from '@/app/ui/search';
import { headers } from 'next/headers';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { ObjectId } from 'mongodb';

type ISearchQuery = {
  page: string;
}

type HomeProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({
  pageParams,
}: {
  pageParams?: {
    memberId?: string;
    page?: string;
  };
}) {


  //< console.log(`remittances page`);
  let memberId: string | undefined = undefined;
  if (pageParams && pageParams.memberId) {
    memberId = pageParams.memberId;
  } else {
    const rePat = /(^.*members\/)([\d\w]+)(\/remittances)/;
    const headerList = headers();
    const pathName = headerList.get("x-current-path") ?? '';
    const patMatches = rePat.exec(pathName);
    if (patMatches !== null) {
      memberId = patMatches[2];
    }
    //< console.log(`memberId from URL ${memberId}`); // to get url
  }

  if (memberId) {

    return (
      <div className="home-page w-full px-8 grow flex flex-col mt-2">
        <hr className='w-full my-3 h-1 border-stone-400' />
        <h2>Remittances:</h2>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <div className='invisible'><Search placeholder="Search members..." /></div>
          <div className='flex justify-between gap-2'>
            <CreateMemberRemittance id={memberId ?? ''} />
            <Link
              href={`/dashboard/members`}
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Back to members
            </Link>
          </div>
        </div>
        <div className="mt-2 result-container">
          <Suspense fallback={<h6 className='text-center ltr'>📡 Loading data please wait ... </h6>}>
            <>
              <Table
                memberId={memberId}
              />
              {/* <Pagination
                  totalPages={totalPages}
                /> */}
            </>
          </Suspense>
        </div>
        {/* <span className='text-sm'>{members.length} of {totalCount} Items </span> */}

      </div>
    );
  } else {
    return (
      <div>No member id provided</div>
    );
  }
}