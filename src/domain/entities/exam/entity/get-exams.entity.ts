import { ListMeta } from "../../common";
import { ExamEntity } from "./exam.entity";

export interface GetExamsEntity {
  data: ExamEntity[];
  meta: ListMeta;
}
