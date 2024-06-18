import React, { Suspense } from 'react';
// import { BookCard } from '@/Client/Components/Home/BookCard';
import { fetchBooks } from '@/Server/actions/BookActions';
import Pagination from '@/Client/Components/Home/Pagination';
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
  const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

  /* begin:: feetch book list */
  const { data: books, totalCount } = await fetchBooks(pageNumber);
  /* end:: feetch book list */


  return (
    <div className="home-page w-full px-8 grow flex flex-col mt-2">
      <h2>Books:</h2>
      <hr className='w-full my-3 h-1 border-stone-400' />
      <span className='text-sm'>{books.length} of {totalCount} Items </span>
      <div className="mt-6 result-container">
        <Suspense fallback={<h6 className='text-center ltr'>📡 Loading data please wait ... </h6>}>
          {books?.length ?
            <>
              {/*books.map((book, index) => (<BookCard key={index} {...book} />))*/}
              {/* <Pagination
                currentPage={pageNumber}
                totalItems={totalCount}
                itemsPerPage={10} // replace this with your actual items per page  
              /> */}
            </>
            :
            <h4 className='text-center'>No books found</h4>}
        </Suspense>
      </div>
    </div>
  );
}