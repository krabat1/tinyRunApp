import { ExerciseModel } from "./exercise-model";

export class WorkoutModel {
    constructor(
        public name: string,
        public exercises: ExerciseModel[] = []
    ) {}

    addExercise(exercise: ExerciseModel) {
        this.exercises.push(exercise);
    }

    removeExercise(index: number) {
        this.exercises.splice(index, 1);
    }

    updateExercise(index: number, exercise: ExerciseModel) {
        this.exercises[index] = exercise;
    }
}
