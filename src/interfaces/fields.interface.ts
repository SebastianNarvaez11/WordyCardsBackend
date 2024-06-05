export interface ILoginFormFields {
  email: string;
  password: string;
}

export interface IRegisterFormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUpdateExerciseFormFields {
  englishWord?: string;
  spanishTranslation?: string;
  rating?: number;
  groupId?: string;
}
