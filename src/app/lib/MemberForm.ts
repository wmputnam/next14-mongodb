import { IMemberDocument } from "@/Server/Service/MemberDocumentService";
import { MemberForm } from "./definitions";

export class MemberFormClass  {
  id: string;
  lastName: string;
  firstName: string;
  constructor(memberObj: Partial<IMemberDocument>) {
    if (memberObj) {
      if (memberObj._id) {
        this.id = memberObj._id.toString();
      } else {
        throw new Error('memberObj must have "_id"');
      }
      this.firstName = memberObj.firstName ? memberObj.firstName : "";
      this.lastName = memberObj.lastName ? memberObj.lastName : "";

    } else {
      throw new Error('memberObj must be provided')
    }
  }
}
