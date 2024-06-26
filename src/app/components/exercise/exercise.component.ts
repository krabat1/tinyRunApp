import { Component, Input, Output, EventEmitter, ViewChild, } from '@angular/core';
import { WorkoutModel } from '../../models/workout-model';
import { ExerciseModel } from '../../models/exercise-model';
import {
  CdkDragDrop, moveItemInArray,
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { DomSanitizer } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';

const EMPTY_ICON =
  `
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
    <path d=""/>
  </svg>
`;

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule,
    CdkDropList, CdkDrag, CdkDragPlaceholder,
    CdkAccordionModule, CdkAccordionItem,
    MatButtonModule, MatIconModule, MatTooltipModule,
    MatInputModule, MatRadioModule],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss'
})
export class ExerciseComponent {

  @Input() workouts!: WorkoutModel[];
  @Input() workout!: WorkoutModel;
  @Input() workout_index!: number;
  @Input() moveWorkouts: boolean = false;
  @Input() is_last_workout!: boolean;
  @Output() exerciseChange = new EventEmitter<void>();
  @Output() expandedChange = new EventEmitter<{ index: number, expanded: boolean }>();
  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;

  durationInsteadOfDistance: boolean = false;
  newExerciseName: string = '';
  newExerciseDuration: number | null = null;
  newExerciseDistance: number | null = null;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('empty', sanitizer.bypassSecurityTrustHtml(EMPTY_ICON));
  }

  /**
 * Event handler for when an accordion item is expanded or collapsed.
 * 
 * Called from the template (<cdk-accordion-item (opened)="onExpanded(true, workout_index)" etc...)
 * Emits an event with the index of the workout and the new expanded state.
 * If the accordion item is collapsed, it calls the closeFormWhenAccClosed method.
 * 
 * @param expanded - The new expanded state of the accordion item.
 * @param index - The index of the workout associated with the accordion item.
 *
 * @returns {void}
  */
  onExpanded(expanded: boolean, index: number): void {
    console.log(index + ' ' + expanded)
    this.expandedChange.emit({ index: this.workout_index, expanded });
    if (expanded === false) {
      this.closeFormWhenAccClosed(index);
    }
  }

  /**
 * Method to close the form and display the button 
 * when the accordion item is collapsed.
 * 
 * @param index - The index of the workout associated with the accordion item.
 * 
 * @returns {void}
 */
  closeFormWhenAccClosed(index: number): void {
    //when closing the accordionitem, close the form too, and disbplay button
    const isExpanded = this.accordionItem.expanded;
    let el = document.querySelectorAll('cdk-accordion-item')[index] as HTMLElement;
    let forms = el.querySelectorAll('.formButtonPairForm');
    let buttons = el.querySelectorAll('.formButtonPairButton');
    let form = forms[0] as HTMLElement;
    let button = buttons[0] as HTMLElement;
    console.log(form)
    console.log(button)
    if (isExpanded === false) {
      //this.accordionItem.open()
      if (form && button) {
        form.style.display = 'none';
        button.style.display = 'block';
      }
    }
  }

  /**
 * Method to open the form and the accordion item when clicking on the add exercise button.
 * If the accordion item is already expanded, it closes the form and the accordion item.
 * 
 * @param event - The mouse event that triggered this method. Not used.
 * @param index - The index of the workout associated with the accordion item.
 * 
 * @returns {void}
 */
  openAddExerciseForm(event: MouseEvent, index: number): void {
    // when clicking to open form, open the form, and the accordion item too, when it is closed
    const isExpanded = this.accordionItem.expanded;
    let el = document.querySelectorAll('cdk-accordion-item')[index] as HTMLElement;
    let forms = el.querySelectorAll('.formButtonPairForm');
    let buttons = el.querySelectorAll('.formButtonPairButton');
    let form = forms[0] as HTMLElement;
    let button = buttons[0] as HTMLElement;
    console.log(form)
    console.log(button)
    if (isExpanded === false) {
      this.accordionItem.open()
      if (form && button) {
        form.style.display = 'block';
        button.style.display = 'none';
      }
    } else if (isExpanded === true) {
      this.accordionItem.close()
      if (form && button) {
        form.style.display = 'block';
        button.style.display = 'none';
      }
    }
  }

  /**
 * Method to edit the name of a workout.
 *
 * @param event - The mouse event that triggered this method.
 * @param workout_index - The index of the workout to be edited. Not used.
 * @param workout - The workout object to be edited.
 *
 * @returns {void}
 */
  editWorkoutName(event: MouseEvent, workout_index: number, workout: WorkoutModel) {
    // Prevent the event from bubbling up to parent elements.
    event.stopPropagation();
    // Prompt the user to enter a new workout name.
    const newName = prompt('Workout name:', workout.name);
    // If the user entered a new name and it's not empty, update the workout name and emit the exerciseChange event.
    if (newName !== null && newName.trim() !== '') {
      this.workout.name = newName.trim();
      this.exerciseChange.emit();
    }
  }

  /**
 * Method to move a workout up or down in the list (array).
 *
 * @param event - The mouse event that triggered this method.
 * @param direction - The direction to move the workout ('up' or 'down').
 * @param index - The index of the workout to be moved.
 *
 * @returns {void}
 */
  moveWorkout(event: MouseEvent, direction: string, index: number) {
    event.stopPropagation();  // Prevent the event from bubbling up to parent elements.

    // Check the direction and index to determine the swap operation.
    if (direction === 'up' && index > 0) {
      // Swap the current workout with the previous workout in the list.
      [this.workouts[index], this.workouts[index - 1]] = [this.workouts[index - 1], this.workouts[index]];
    } else if (direction === 'down' && index < this.workouts.length - 1) {
      // Swap the current workout with the next workout in the list.
      [this.workouts[index], this.workouts[index + 1]] = [this.workouts[index + 1], this.workouts[index]];
    } else {
      // If the direction or index is invalid, log an error message.
      console.error('Invalid move');
    }
  }

  /**
 * Method to add a new exercise to the current workout.
 * 
 * @remarks
 * This method checks if the new exercise name is not empty and if either the duration or distance is provided.
 * If these conditions are met, it creates a new ExerciseModel object with the provided name, duration, and distance.
 * Then, it adds the new exercise to the current workout using the addExercise method of the WorkoutModel class.
 * Finally, it emits the exerciseChange event to notify any subscribers that the exercise list has been updated.
 * 
 * @returns {void}
 */
  addExercise(): void {
    if (this.newExerciseName.trim() && (this.newExerciseDuration !== null || this.newExerciseDistance !== null)) {
      const exercise = new ExerciseModel(
        this.newExerciseName.trim(),
        this.newExerciseDuration !== null ? this.newExerciseDuration : undefined,
        this.newExerciseDistance !== null ? this.newExerciseDistance : undefined
      );
      this.workout.addExercise(exercise);
      this.exerciseChange.emit();
      this.resetNewExercise()
    }
  }

  /**
 * Method to reset the new exercise form inputs.
 * 
 * This method clears the new exercise name, duration, and distance inputs.
 * It is called when the user cancels the addition of a new exercise.
 * 
 * @returns {void}
 */
  resetNewExercise(): void {
    this.newExerciseName = '';
    this.newExerciseDuration = null;
    this.newExerciseDistance = null;
  }

  /**
 * Method to cancel the addition of a new exercise.
 * 
 * This method resets the new exercise form inputs and hides the form, 
 * while displaying the add exercise button.
 * 
 * @param event - The mouse event that triggered this method.
 * 
 * @returns {void}
 */
  cancelAddExercise(event: MouseEvent): void {
    this.resetNewExercise()
    const target = (event.target || event.srcElement || event.currentTarget) as HTMLElement;
    const form = target.closest('.formButtonPairForm') as HTMLElement;
    const parentDiv = target.closest('.workout') as HTMLElement;
    const button = parentDiv.querySelector('.formButtonPairButton') as HTMLElement;

    if (button && button.tagName === 'BUTTON') {
      button.style.display = 'block';
      form.style.display = 'none';
    }
  }

  /**
 * Edits an exercise in the current workout.
 *
 * @param index - The index of the exercise to be edited.
 * @param exercise - The exercise object to be edited.
 *
 * @remarks
 * This method prompts the user to enter a new name for the exercise.
 * It also asks the user if they want to keep the exercise time-based or distance-based.
 * Depending on the user's choice, it prompts the user to enter a new duration or distance.
 * It then updates the exercise object with the new values and emits the exerciseChange event.
 *
 * @returns {void}
 */
  editExercise(index: number, exercise: ExerciseModel): void {
    // Ask the user for the new exercise name.
    const newName = prompt('Gyakorlat neve:', exercise.name);

    //  If the user entered a new name (did not click "Cancel" or leave it blank), then we continue.
    if (newName !== null && newName.trim() !== '') {
      let newDuration: string | number | null = null;
      let newDistance: string | number | null = null;

      // If the exercise is a time-based exercise.
      if (exercise.duration !== undefined && exercise.duration !== null) {
        const keepDuration = confirm('If you want to keep the exercise time-based, press [OK].\nIf you would like to change, press the [Cancel] button.');

        // If the user wants to keep the exercise as time-based.
        if (keepDuration === true) {
          let newDurationAnswer = prompt('Duration (sec):', exercise.duration.toString());
          while (newDurationAnswer !== null && isNaN(parseInt(newDurationAnswer))) {
            newDurationAnswer = prompt('❗️❗️ Invalid value.\nPlease enter a whole number (eg. 3) for the duration (sec):', '');
          }
          // If the user opted out of specifying a new duration, we will keep the original duration.
          if (newDurationAnswer === null) {
            newDuration = exercise.duration.toString();
          } else {
            newDuration = newDurationAnswer;
          }
          newDistance = null;  // reset distance if duration is edited
        } else {
          // If the user does not want to keep the time-based exercise, but wants a distance-based one.
          let newDistanceAnswer = prompt('Distance (km):', '');
          if (newDistanceAnswer !== null) {
            newDistanceAnswer = newDistanceAnswer.replace(',', '.')
          }
          while (newDistanceAnswer !== null && isNaN(parseFloat(newDistanceAnswer))) {
            newDistanceAnswer = prompt('❗️❗️ Incorrect value.\nUse decimal number (eg. 3.5) or whole number (eg. 4).\nPlease enter a number for the distance (km):', '');
          }
          // If the user opted out of entering the new distance, we will keep the original duration.
          if (newDistanceAnswer === null) {
            newDistance = null;
            newDuration = exercise.duration.toString();
          } else {
            newDistance = newDistanceAnswer;
            newDuration = null;  // reset duration if distance is edited
          }
        }
      }
      // If the exercise is a distance-based exercise.
      else if (exercise.distance !== undefined && exercise.distance !== null) {
        const keepDistance = confirm('If you want to keep the exercise distance-based, press [OK].\nIf you would like to change, press the [Cancel] button.');

        // If the user wants to keep the distance based exercise.
        if (keepDistance === true) {
          let newDistanceAnswer = prompt('Distance (km):', exercise.distance.toString());
          if (newDistanceAnswer !== null) {
            newDistanceAnswer = newDistanceAnswer.replace(',', '.')
          }
          while (newDistanceAnswer !== null && isNaN(parseFloat(newDistanceAnswer))) {
            newDistanceAnswer = prompt('❗️❗️ Incorrect value.\nUse decimal number (eg. 3.5) or whole number (eg. 4).\nPlease enter a number for the distance (km):', exercise.distance.toString());
          }
          // If the user opted out of entering the new distance, we will keep the original distance.
          if (newDistanceAnswer === null) {
            newDistance = exercise.distance.toString();
          } else {
            newDistance = newDistanceAnswer;
          }
          newDuration = null;  // reset duration if distance is edited
        } else {
          // If the user does not want to keep the distance-based exercise.
          let newDurationAnswer = prompt('Duration (sec):', '');
          while (newDurationAnswer !== null && isNaN(parseInt(newDurationAnswer))) {
            newDurationAnswer = prompt('❗️❗️ Invalid value.\nPlease enter a whole number (eg. 3) for the duration (sec):', '');
          }
          // If the user opted out of entering the new duration, we will keep the original distance.
          if (newDurationAnswer === null) {
            newDuration = null;
            newDistance = exercise.distance.toString();
          } else {
            newDuration = newDurationAnswer;
            newDistance = null;  // reset distance if duration is edited
          }
        }
      }

      // We update the exercise object with the new values.
      exercise.name = newName.trim();
      exercise.duration = newDuration !== null ? parseInt(newDuration) : undefined;
      exercise.distance = newDistance !== null ? parseFloat(newDistance) : undefined;

      // We update the WorkoutModel with the new exercise object.
      this.workout.updateExercise(index, exercise);
      // We emit the exerciseChange event.
      this.exerciseChange.emit();
    }
  }

  /**
 * Method to switch between displaying duration and distance inputs in the new exercise form.
 * 
 * @remarks
 * This method toggles the value of the `durationInsteadOfDistance` property, which determines
 * whether the duration or distance input fields are displayed in the new exercise form.
 * It also resets the new exercise duration and distance inputs to null.
 * 
 * @returns {void}
 */
  switchTimeDistance() {
    this.durationInsteadOfDistance = !this.durationInsteadOfDistance;
    //this.newExerciseName = '';
    this.newExerciseDuration = null;
    this.newExerciseDistance = null;
  }

  /**
 * Method to remove a workout from the list.
 * 
 * @remarks
 * This method prompts the user for confirmation before removing the workout.
 * If the user confirms, it removes the workout from the list and emits the exerciseChange event.
 * It also logs a message indicating that the workout has been deleted.
 * 
 * @param index - The index of the workout to be removed from the list.
 * 
 * @returns {void}
 */
  removeWorkout(index: number): void {
    if (confirm('Are you sure you want to delete this workout?')) {
      //this.workout.removeExercise(index);
      this.workouts.splice(index, 1);
      this.exerciseChange.emit();
      console.log('Workout' + index + 'deleted')
    }
  }

  /**
 * Method to remove an exercise from the current workout.
 * 
 * @remarks
 * This method prompts the user for confirmation before removing the exercise.
 * If the user confirms, it removes the exercise from the workout and emits the exerciseChange event.
 * 
 * @param index - The index of the exercise to be removed from the workout.
 * 
 * @returns {void}
 */
  removeExercise(index: number): void {
    if (confirm('Are you sure you want to delete this exercise?')) {
      this.workout.removeExercise(index);
      this.exerciseChange.emit();
    }
  }

  /**
 * Method to handle the drop event when dragging and dropping exercises.
 * 
 * @remarks
 * This method is called when an exercise is dropped in a new position.
 * It uses the `moveItemInArray` function to move the exercise in the `exercises` array of the `workout` object.
 * After the exercise is moved, it emits the `exerciseChange` event to notify any subscribers that the exercise list has been updated.
 * 
 * @param event - The `CdkDragDrop` event object that contains information about the drag and drop operation.
 * @param event.previousIndex - The index of the exercise before it was dropped.
 * @param event.currentIndex - The index of the exercise after it was dropped.
 * 
 * @returns {void}
 */
  drop(event: CdkDragDrop<ExerciseModel[]>): void {
    moveItemInArray(this.workout.exercises, event.previousIndex, event.currentIndex);
    this.exerciseChange.emit();
  }
}
