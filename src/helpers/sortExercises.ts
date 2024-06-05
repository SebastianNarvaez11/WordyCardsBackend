interface IExercise {
  id: string;
  englishWord: string;
  spanishTranslation: string;
  rating: number;
  updateAt: Date;
}

export const disorderExercises = (exercises: IExercise[]): IExercise[] => {
  for (let i = exercises.length - 1; i > 0; i--) {
    let indiceAleatorio = Math.floor(Math.random() * (i + 1));
    let temporal = exercises[i];
    exercises[i] = exercises[indiceAleatorio];
    exercises[indiceAleatorio] = temporal;
  }

  return exercises;
};

export const selectIdealExercises = (
  exercises: IExercise[],
  maxLength: number = 20 // cant max por ronda
): IExercise[] => {
  //   if (exercises.length <= 12) maxLength = exercises.length; //si el arreglo tiene menos de 12 ejercicios, se revisan todos
  //   if (exercises.length > 12 && exercises.length <= 40)
  //     maxLength = Math.floor(exercises.length / 2); //si tiene entre 12 y 40, se revisan la mitad

  let easy: IExercise[] = [];
  let medium: IExercise[] = [];
  let hard: IExercise[] = [];

  exercises.forEach((word) => {
    if (word.rating === 2) easy.push(word);
    if (word.rating === 1) medium.push(word);
    if (word.rating === 0) hard.push(word);
  });

  // si todas los ejercicios ya son fáciles se devuelven 20 ejercicios al azar
  if (easy.length === exercises.length) {
    return disorderExercises(
      easy
        .sort(
          (a, b) =>
            new Date(a.updateAt).getTime() - new Date(b.updateAt).getTime()
        )
        .slice(0, 20)
    );
  }

  easy = easy.sort(
    (a, b) => new Date(a.updateAt).getTime() - new Date(b.updateAt).getTime()
  ); //ordenar por fecha mas antigua
  medium = medium.sort(
    (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()
  ); //ordenar por fecha mas reciente
  hard = hard.sort(
    (a, b) => new Date(a.updateAt).getTime() - new Date(b.updateAt).getTime()
  ); //ordenar por fecha mas reciente

  let maxEasy = Math.floor((20 * maxLength) / 100); //20%
  let maxMedium = Math.floor((40 * maxLength) / 100); //40%
  let maxHard = Math.floor((40 * maxLength) / 100); //40%

  if (easy.length > maxEasy) {
    easy = easy.slice(0, maxEasy - 1); // ==> 20%
  }

  if (medium.length > maxMedium) {
    medium = medium.slice(0, maxMedium - 1); // ==> 40%
  }

  if (hard.length > maxHard) {
    hard = hard.slice(0, maxHard - 1); // ==> 40%
  }

   //  console.log({ easy, medium, hard });

  const select_exercises = [...easy, ...medium, ...hard];

  return disorderExercises(select_exercises);
};
