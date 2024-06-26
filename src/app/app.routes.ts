import { Routes } from '@angular/router'
import { TaskmanComponent } from './components/taskman/taskman.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { AccountComponent } from './components/auth/account/account.component';
import { WorkoutComponent } from './components/workout/workout.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
// https://www.linkedin.com/pulse/lazyload-standalone-angular-components-using-router-muhammad-awais-xwzrf/
// https://medium.com/@bhargavr445/angular-standalone-components-lazy-loading-part-3-9ce7f9c5a131

export const routes: Routes =  [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./components/home/home.component').then( c => c.HomeComponent) },
    { path: 'sign-up', loadComponent: () => import('./components/auth/signup/signup.component').then( c => c.SignupComponent) },
    { path: 'tasks', loadComponent: () => import('./components/taskman/taskman.component').then( c => c.TaskmanComponent) },
    { path: 'workouts', loadComponent: () => import('./components/workout/workout.component').then( c => c.WorkoutComponent) },
    { path: 'exercises', loadComponent: () => import('./components/exercise/exercise.component').then( c => c.ExerciseComponent) },

    { path: 'sign-in', loadComponent: () => import('./components/auth/signin/signin.component').then( c => c.SigninComponent) },
    { path: 'sign-out', loadComponent: () => import('./components/auth/signin/signin.component').then( c => c.SigninComponent) },
    { path: 'account', loadComponent: () => import('./components/auth/account/account.component').then( c => c.AccountComponent) },
    { path: '**', redirectTo: '/home' }
]
// https://stackoverflow.com/a/75733775/4279940 for isLoggedIn

export function getRoutes(): Routes {
    // URL szegmensek tömbje
    const urlSegments: string[] = window.location.pathname.split('/')
    urlSegments.shift();
    console.log('urlSegments')
    console.log(urlSegments)
    let routes: Routes = [];
    let first = urlSegments[0]
    let second = urlSegments[1]
    let third = urlSegments[2]
    console.log(`${first} ${second} ${third}`)
    //urlSegments.length == 0 ? routes.push({path: '', component: HomeComponent}) : null ;

    if(second === undefined || third === undefined){
        if(first === '') routes.push({path: first, loadComponent: () => import('./components/home/home.component').then( c => c.HomeComponent)})
        if(first === 'home') routes.push({path: first, loadComponent: () => import('./components/home/home.component').then( c => c.HomeComponent)})
        if(first === 'tasks') routes.push({path: first, loadComponent: () => import('./components/taskman/taskman.component').then( c => c.TaskmanComponent)})
        if(first === 'workouts') routes.push({path: first, loadComponent: () => import('./components/workout/workout.component').then( c => c.WorkoutComponent)})
        if(first === 'exercises') routes.push({path: first, loadComponent: () => import('./components/exercise/exercise.component').then( c => c.ExerciseComponent)})
        if(first === 'sign-up') routes.push({path: first, loadComponent: () => import('./components/auth/signup/signup.component').then( c => c.SignupComponent)})
        if(first === 'sign-in') routes.push({path: first, loadComponent: () => import('./components/auth/signin/signin.component').then( c => c.SigninComponent)})
    }
    else if(third === undefined){
        routes.push({path: first, loadComponent: () => import('./components/home/home.component').then( c => c.HomeComponent)})
    }
    else(
        routes.push({path: first, loadComponent: () => import('./components/home/home.component').then( c => c.HomeComponent)})
    )
    console.log(routes)
    if(routes.length === 0){
        //404
        //routes.push({path: '**', component: NotfoundComponent})
    }
    return routes;
}