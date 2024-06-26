import { clientPromise } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";

export class Repository<T> implements IRepository<T> {
  private collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  /**
   * @async @function createDocument
   * @param data -- document
   * @returns documentId as string
   */
  async createDocument(
    data: Partial<T>
  ): Promise<string | undefined> {
    try {
      // Await the client promise to get an instance of MongoClient
      const client: MongoClient = await clientPromise;

      // Access the database and the collection
      const collection = client.db().collection(this.collection);

      const result = await collection
        .insertOne(data)
        ;

      return result.insertedId.toString();
    } catch (error: unknown) {
      // Catch and log any connection errors
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          console.error("Failed to connect to MongoDB. Connection refused.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
      return undefined;
    }
  }

  /** 
   * @async @function fetchDocumentsFiltered
   * @description find and return documents in the collection
   * @param [filter={}] -- Partial<T> MongoDB filter
   * @param [page=1] -- which page of results to return 
   * @param [limit=10] -- max docs per page
   * @param [sort={}] -- sort ordering
   * @param [projection={}] -- which doc properties
   * @returns Promise { <data: T[], totalCount:number>} -- projected doc array (up to limit) and size of filtered set
   */
  async fetchDocumentsFiltered(
    filter: Partial<T> = {},
    page: number = 1,
    limit: number = 10,
    sort: any = {},
    projection: Partial<Record<keyof T, 1 | 0>> = {},
  ): Promise<{ data: T[], totalCount: number }> {
    try {
      // Await the client promise to get an instance of MongoClient (singleton)
      const client: MongoClient = await clientPromise;

      // Calculate how many documents to skip
      const skip = (page - 1) * limit;

      // Access the database and the collection
      const collection = client.db().collection(this.collection);

      // Get the total count of all items
      const totalCount = await collection.countDocuments(filter);

      // Access the database and the collection, then find documents matching the filter
      // If a projection is provided, apply it to the query
      // Convert the result to an array and return it
      const data = await collection
        .find(filter, { projection })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray();

      return { data: data as unknown as T[], totalCount };
    } catch (error: unknown) {
      // Catch and log any connection errors
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          console.error("Failed to connect to MongoDB. Connection refused.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
      return { data: [], totalCount: 0 };
    }
  }

  /** 
   * @async @function fetchDocumentById
   * @description find and return documents in the collection
   * @param [filter={}] -- Partial<T> MongoDB filter
   * @param [page=1] -- which page of results to return 
   * @param [limit=10] -- max docs per page
   * @param [sort={}] -- sort ordering
   * @param [projection={}] -- which doc properties
   * @returns Promise { <data: T[], totalCount:number>} -- projected doc array (up to limit) and size of filtered set
   */
  async fetchDocumentById(
    documentId: string,
    projection: any = {}
  ): Promise<T | undefined> {
    try {
      // Await the client promise to get an instance of MongoClient (singleton)
      const client: MongoClient = await clientPromise;

      // Access the database and the collection
      const collection = client.db().collection(this.collection);

      const filter: any = { _id: new ObjectId(documentId) };

      const data: any = await collection
        .findOne(filter, { projection });

      return data as unknown as T;
    } catch (error: unknown) {
      // Catch and log any connection errors
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          console.error("Failed to connect to MongoDB. Connection refused.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
      return undefined;
    }
  }

  // Asynchronously find documents in the collection
  /**
 * @async @function fetchFilteredDataPageCount
 * @description find and return count of doc  pages
 * @param [filter={}] -- Partial<T> MongoDB filter
 * @param [limit=10] -- max docs per page
 * @returns Promise { number } -- pages of doc or NaN on error
 */

  async fetchDocumentFilteredPageCount(
    filter: Partial<T>,
    limit: number = 10,
  ): Promise<number> {
    try {
      // Await the client promise to get an instance of MongoClient
      const client: MongoClient = await clientPromise;

      // Access the database and the collection
      const collection = client.db().collection(this.collection);

      const documentCount = await collection
        .countDocuments(filter)
        ;

      const pageCount = Math.ceil(documentCount / limit);

      return pageCount;
    } catch (error: unknown) {
      // Catch and log any connection errors
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          console.error("Failed to connect to MongoDB. Connection refused.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
      return NaN;
    }
  }

  /**
   * @async @function updateDocument
   * @param filter
   * @param updateDocument
   * @returns document
   */
  async updateDocument(
    documentId: string,
    updateDocument: any
  ): Promise<T | undefined> {
    try {
      // Await the client promise to get an instance of MongoClient
      const client: MongoClient = await clientPromise;

      const filter = { _id: new ObjectId(documentId) };
      const setter = { $set: updateDocument }

      console.log(`updateDocument filter: ${JSON.stringify(filter)}`);
      console.log(`updateDocument setter: ${JSON.stringify(setter)}`);
      // Access the database and the collection
      const collection = client.db().collection(this.collection);

      const result = await collection
        .updateOne(
          filter, setter)
        ;
      console.log(`updateDocument result: ${JSON.stringify(result)}`);
      return result as unknown as T;
    } catch (error: unknown) {
      // Catch and log any connection errors
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          console.error("Failed to connect to MongoDB. Connection refused.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
      return undefined;
    }
  }

  /**
   * @async @function deleteDocument
   * @param filter 
   * @returns number of documents deleted
   */
  async deleteDocument(
    documentId: string,
  ): Promise<number> {
    try {
      // Await the client promise to get an instance of MongoClient
      const client: MongoClient = await clientPromise;

      // Access the database and the collection
      const collection = client.db().collection(this.collection);

      const filter: any = { _id: new ObjectId(documentId) };

      const result = await collection
        .deleteOne(
          filter)
        ;

      return result.deletedCount;
    } catch (error: unknown) {
      // Catch and log any connection errors
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          console.error("Failed to connect to MongoDB. Connection refused.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
      return 0;
    }
  }

}