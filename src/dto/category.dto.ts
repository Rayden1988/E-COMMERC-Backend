export type CategoryCreateDTO = {
  name: string;
};

export type CategoryUpdateDTO = {
  id(id: any): unknown;
  name: string;
};

export type CategoryResponseDTO = {
  id: string;
  name: string;
};
