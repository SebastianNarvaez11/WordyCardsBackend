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
export interface ICreateExerciseFormFields {
  id?: string;
  englishWord: string;
  spanishTranslation: string;
  image?: string | null;
}

export interface ICreateGroupFormFields {
  name: string;
  iconName: string;
  maxNumberOfExercisesPerRound: string;
  exercises: ICreateExerciseFormFields[];
}

export interface IUpdateGroupFormFields {
  name?: string;
  iconName?: string;
  maxNumberOfExercisesPerRound?: string;
  exercises?: ICreateExerciseFormFields[];
}
