export interface ICategory {

  id: number;
  name: string;
  parentCategory: ICategory;
  isDeleted: boolean;

}
