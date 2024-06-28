import React, { Suspense } from 'react';
import { fetchMembersPageCount } from '@/Server/actions/MemberDocumentActions';
import { Table } from '@/app//ui/members/table';
import { Pagination } from '@/app//ui/members/pagination';
import { CreateMemberDocument } from '@/app/ui/members/buttons';
import Search from '@/app/ui/search';
import { usePathname } from 'next/navigation';

type ISearchQuery = {
  page: string;
}

type HomeProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const DOCS_PER_PAGE = 12;

  const sortByName = () => ({ lastName: 1, firstName: 1 });

  const filterActiveOnly = () => ({ isActive: true });
  // get the current page number
  const { page } = searchParams as ISearchQuery;
  const pageNumber: number = page && !isNaN(Number(page)) ? Number(page) : 1;

  const totalPages = await fetchMembersPageCount(DOCS_PER_PAGE);

  return (
    <div className="home-page w-full px-8 grow flex flex-col mt-2">
      <hr className='w-full my-3 h-1 border-stone-400' />
      <h2>Active Members and Volunteers:</h2>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search members..." />
        <CreateMemberDocument />
      </div>

      <div className="mt-2 result-container">
        <Suspense fallback={<h6 className='text-center ltr'>📡 Loading data please wait ... </h6>}>
          {totalPages > 0 ?
            <>
              <Table
                currentPage={currentPage}
                limit={DOCS_PER_PAGE}
                filter={filterActiveOnly()}
                sort={sortByName()}
                query={query}
              />
              <Pagination
                totalPages={totalPages}
              />
            </>
            :
            <h4 className='text-center'>No members found</h4>
          }
        </Suspense>
      </div>
      {/* <span className='text-sm'>{members.length} of {totalCount} Items </span> */}

    </div>
  );
}