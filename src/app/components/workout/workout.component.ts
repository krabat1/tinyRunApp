import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../services/app/workout.service';
import { WorkoutModel } from '../../models/workout-model';
import { FormsModule } from '@angular/forms';
import { ExerciseComponent } from '../exercise/exercise.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CdkAccordion, CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, FormsModule, ExerciseComponent, MatButtonModule, MatIconModule, MatTooltipModule,MatInputModule, CdkAccordionModule],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss',
  //providers: [{ provide: CdkAccordion, useValue: {} }] // Az accordion konfigurációja
})
export class WorkoutComponent implements OnInit/*, AfterViewInit*/ {
  workouts: WorkoutModel[] = [];
  newWorkoutName: string = '';
  moveWorkouts: boolean = false;

  constructor(private workoutService: WorkoutService) { }

  /**
   * Initializes the component by loading the workouts from the service.
   *
   * @remarks
   * This method is called when the component is initialized.
   * It retrieves the list of workouts from the `workoutService` using the `loadWorkouts` method
   * and assigns it to the `workouts` property of the component.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.workouts = this.workoutService.loadWorkouts();
  }

  onExpandedChange(event: { index: number, expanded: boolean }) {
    console.log(`Item at index ${event.index} expanded state changed to ${event.expanded}`);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  /**
   * Adds a new workout to the list of workouts.
   *
   * @remarks
   * This function checks if the new workout name is not empty,
   * creates a new WorkoutModel instance with the trimmed name,
   * adds it to the workouts array, saves the workouts,
   * clears the newWorkoutName input field, and logs success message and the updated workouts array.
   *
   * @throws Will throw an error if the newWorkoutName is empty.
   *
   * @param {string} newWorkoutName - The name of the new workout.
   * @returns {void}
   */
  addWorkout(): void {
    if (this.newWorkoutName.trim()) {
      const workout = new WorkoutModel(this.newWorkoutName.trim());
      this.workouts.push(workout);
      this.saveWorkouts();
      this.newWorkoutName = '';
      console.log('Workout added successfully')
      console.log(this.workouts)
    } else {
      throw new Error('New workout name cannot be empty.');
    }
  }

  /**
   * Enables or disables the ability to move workouts in the list.
   *
   * @remarks
   * This function toggles the `moveWorkouts` property, which determines whether the workouts can be moved or not.
   * When `moveWorkouts` is true, the user can drag and drop workouts to rearrange their order.
   * When `moveWorkouts` is false, the user cannot drag and drop workouts.
   *
   * @returns {void}
   */
  enableWorkoutsMove(): void {
    this.moveWorkouts = !this.moveWorkouts;
  }

  /**
   * Saves the current list of workouts to the local storage.
   *
   * @remarks
   * This function calls the `saveWorkouts` method of the `WorkoutService`
   * to persist the current state of the workouts array.
   *
   * @throws Will throw an error if the `workoutService.saveWorkouts` method throws an error.
   *
   * @param {void}
   * @returns {void}
   */
  saveWorkouts(): void {
    this.workoutService.saveWorkouts(this.workouts);
  }

  /**
   * Exports the current list of workouts to a JSON file.
   *
   * @remarks
   * This function creates a Blob object containing the JSON representation of the workouts array,
   * generates a URL for the Blob object, creates an anchor element, sets the href attribute to the URL,
   * sets the download attribute to 'workouts.json', appends the anchor element to the document body,
   * triggers a click event on the anchor element to initiate the download, removes the anchor element from the document body,
   * and revokes the URL object to free up system resources.
   *
   * @returns {void}
   */
  exportWorkouts(): void {
    const dataStr = this.workoutService.exportWorkouts(this.workouts);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workouts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Opens the file selection dialog for importing workouts.
   *
   * @remarks
   * This function retrieves the file input element using its type attribute,
   * and then triggers a click event on the element to open the file selection dialog.
   * The file selection dialog allows users to select a JSON file containing workout data.
   *
   * @returns {void}
   * @throws Will throw an error if the file input element is not found.
   */
  importClick(): void {
    let input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.click();
    } else {
      throw new Error('File input element not found.');
    }
  }

  /**
   * Imports workouts from a JSON file.
   *
   * @remarks
   * This function handles the file selection event triggered by the user when importing workouts.
   * It retrieves the selected file from the event, reads its content as text,
   * and then calls the `importWorkouts` method of the `WorkoutService` to parse and import the workouts.
   * The imported workouts are then saved to the local storage using the `saveWorkouts` method.
   *
   * @param {any} event - The event object containing the file selection details.
   * @returns {void}
   * @throws Will throw an error if the file input element is not found or if the file content cannot be read.
   */
  importWorkouts(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        this.workouts = this.workoutService.importWorkouts(fileContent);
        this.saveWorkouts();
      };
      reader.readAsText(file);
    }
  }
}
