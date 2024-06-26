import { Injectable } from '@angular/core';
import { WorkoutModel } from '../../models/workout-model';
import { ExerciseModel } from '../../models/exercise-model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  private storageKey = 'workouts';

  constructor() { }

  /**
   * Saves the provided workouts to the local storage.
   *
   * @param workouts - An array of WorkoutModel objects to be saved.
   * @returns {void}
   *
   * @remarks
   * This method uses the `localStorage` API to store the workouts data.
   * The workouts are serialized into a JSON string before being stored.
   *
   * @example
   * ```typescript
   * const workouts: WorkoutModel[] = [new WorkoutModel('My Workout'), new WorkoutModel('Another Workout')];
   * workoutService.saveWorkouts(workouts);
   * ```
   */
  saveWorkouts(workouts: WorkoutModel[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(workouts));
  }

  /**
   * Loads workouts from the local storage.
   *
   * @returns {WorkoutModel[]} An array of WorkoutModel objects loaded from local storage.
   *
   * @remarks
   * This method uses the `localStorage` API to retrieve the workouts data.
   * The workouts data is expected to be stored as a JSON string.
   * If no workouts data is found in local storage, an empty array is returned.
   *
   * @example
   * ```typescript
   * const loadedWorkouts: WorkoutModel[] = workoutService.loadWorkouts();
   * ```
   */
  loadWorkouts(): WorkoutModel[] {
    const workoutsData = localStorage.getItem(this.storageKey);
    if (workoutsData) {
      return JSON.parse(workoutsData).map((workoutData: any) => {
        const workout = new WorkoutModel(workoutData.name);
        workout.exercises = workoutData.exercises.map((exData: any) => new ExerciseModel(exData.name, exData.duration, exData.distance));
        return workout;
      });
    }
    return [];
  }

  /**
   * Exports the provided workouts as a JSON string.
   *
   * @param workouts - An array of WorkoutModel objects to be exported.
   * @returns {string} A JSON string representing the workouts.
   *
   * @remarks
   * This method uses the `JSON.stringify` function to convert the workouts into a JSON string.
   * The JSON string is formatted with two spaces for indentation.
   *
   * @example
   * ```typescript
   * const workouts: WorkoutModel[] = [new WorkoutModel('My Workout'), new WorkoutModel('Another Workout')];
   * const exportedWorkouts = workoutService.exportWorkouts(workouts);
   * console.log(exportedWorkouts);
   * // Output:
   * // [
   * //   {
   * //     "name": "My Workout",
   * //     "exercises": []
   * //   },
   * //   {
   * //     "name": "Another Workout",
   * //     "exercises": []
   * //   }
   * // ]
   * ```
   */
  exportWorkouts(workouts: WorkoutModel[]): string {
    return JSON.stringify(workouts, null, 2);
  }

  /**
   * Imports workouts from a JSON string.
   *
   * @param fileContent - A JSON string representing the workouts to be imported.
   * @returns {WorkoutModel[]} An array of WorkoutModel objects imported from the JSON string.
   *
   * @remarks
   * This method uses the `JSON.parse` function to convert the JSON string into a JavaScript object.
   * The JavaScript object is expected to be an array of workout data, where each workout data is an object with properties:
   * - `name` (string): The name of the workout.
   * - `exercises` (array): An array of exercise data, where each exercise data is an object with properties:
   *   - `name` (string): The name of the exercise.
   *   - `duration` (number): The duration of the exercise.
   *   - `distance` (number): The distance of the exercise.
   *
   *   !!! An exercise can be only distance-based or only time-based !!!
   * 
   * @example
   * ```typescript
   * const fileContent = `
   * [
   *   {
   *     "name": "My Workout",
   *     "exercises": [
   *       {
   *         "name": "Push-ups",
   *         "duration": 30,
   *         "distance": null
   *       },
   *       {
   *         "name": "Squats",
   *         "duration": 45,
   *         "distance": null
   *       }
   *     ]
   *   },
   *   {
   *     "name": "Another Workout",
   *     "exercises": [
   *       {
   *         "name": "Running",
   *         "duration": null,
   *         "distance": 5
   *       },
   *       {
   *         "name": "Cycling",
   *         "duration": null,
   *         "distance": 10
   *       }
   *     ]
   *   }
   * ]
   * `;
   * const importedWorkouts = workoutService.importWorkouts(fileContent);
   * console.log(importedWorkouts);
   * // Output:
   * // [
   * //   WorkoutModel {
   * //     name: 'My Workout',
   * //     exercises: [
   * //       ExerciseModel { name: 'Push-ups', duration: 30, distance: null },
   * //       ExerciseModel { name: 'Squats', duration: 45, distance: null }
   * //     ]
   * //   },
   * //   WorkoutModel {
   * //     name: 'Another Workout',
   * //     exercises: [
   * //       ExerciseModel { name: 'Running', duration: null, distance: 5 },
   * //       ExerciseModel { name: 'Cycling', duration: null, distance: 10 }
   * //     ]
   * //   }
   * // ]
   * ```
   */
  importWorkouts(fileContent: string): WorkoutModel[] {
    const workoutsData = JSON.parse(fileContent);
    return workoutsData.map((workoutData: any) => {
      const workout = new WorkoutModel(workoutData.name);
      workout.exercises = workoutData.exercises.map((exData: any) => new ExerciseModel(exData.name, exData.duration, exData.distance));
      return workout;
    });
  }
}
