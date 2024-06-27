import { IMemberDocument } from "@/Server/Service/MemberDocumentService";
import { sTransformIMemberDocumentToMemberForm as s } from "@/Server/actions/MemberDocumentActions";

export const transformIMemberDocumentToMemberForm = async (member: IMemberDocument) => {
  const serverResult = await s(member);
  return JSON.parse(serverResult);

}