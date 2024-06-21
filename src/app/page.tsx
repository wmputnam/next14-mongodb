import React, { Suspense } from 'react';
// import { BookCard } from '@/Client/Components/Home/BookCard';
import { fetchMembers, fetchMembersPageCount } from '@/Server/actions/MemberDocumentActions';
import { MemberCard } from '@/Client/Components/Home/MemberCard';
// import { Pagination } from '@/Client/Components/Home/Pagination';
import { MembersTable } from '@/app//ui/members/table';
import { Pagination } from '@/app//ui/members/pagination';

type ISearchQuery = {
  page: string;
}

type HomeProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Home({
  searchParams
}: HomeProps) {
  // get the current page number
  const { page } = searchParams as ISearchQuery;
  const pageNumber: number = page && !isNaN(Number(page)) ? Number(page) : 1;
  // const ITEMS_PER_PAGE = 27;

  /* begin:: fetch book list */
  // const { data: members, totalCount } = await fetchMembers(pageNumber, ITEMS_PER_PAGE);
  /* end:: fetch book list */

  const totalPages = await fetchMembersPageCount(14);


  return (
    <div className="home-page w-full px-8 grow flex flex-col mt-2">
      <hr className='w-full my-3 h-1 border-stone-400' />
      <h2>Members:</h2>
      <div className="mt-6 result-container">
        <Suspense fallback={<h6 className='text-center ltr'>📡 Loading data please wait ... </h6>}>
          {totalPages > 0 ?
            <>
              <MembersTable
                currentPage={pageNumber}
                limit={14}

              />
              <Pagination
                totalPages={totalPages}
              />
            </>
            :
            <h4 className='text-center'>No books found</h4>
          }
        </Suspense>
      </div>
      {/* <span className='text-sm'>{members.length} of {totalCount} Items </span> */}

    </div>
  );
}