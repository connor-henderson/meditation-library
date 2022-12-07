import { Model } from "objection";

export default class BaseModel extends Model {
  id: any;

  createdAt: string;

  updatedAt: string;

  deletedAt: string | null;
}
