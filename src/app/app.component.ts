import {LayoutModule} from '@angular/cdk/layout';
import { BreakpointObserver,Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserService } from './services/auth/user.service';
import { AuthService } from './services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop'; 
/*import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';*/
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutModule, CommonModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule, MatDividerModule, MatSlideToggleModule/*,MatButtonModule,MatIconModule,MatListModule,MatToolbarModule,MatDividerModule,MatDialogModule,MatFormFieldModule,MatInputModule*/,  RouterOutlet, RouterModule, FormsModule, DragDropModule],
  templateUrl: './app.component.html',
  styleUrls:  ['./app.component.scss', './app.component.theme.scss']
})
export class AppComponent implements OnInit{

  @ViewChild('darkModeSwitch', { read: ElementRef }) element: ElementRef | undefined;
  @HostBinding('class') themeClass! : string ;

  sun = 'M12 15.5q1.45 0 2.475-1.025Q15.5 13.45 15.5 12q0-1.45-1.025-2.475Q13.45 8.5 12 8.5q-1.45 0-2.475 1.025Q8.5 10.55 8.5 12q0 1.45 1.025 2.475Q10.55 15.5 12 15.5Zm0 1.5q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.537 1.463T17 12q0 2.075-1.463 3.537T12 17ZM1.75 12.75q-.325 0-.538-.213Q1 12.325 1 12q0-.325.212-.537Q1.425 11.25 1.75 11.25h2.5q.325 0 .537.213Q5 11.675 5 12q0 .325-.213.537-.213.213-.537.213Zm18 0q-.325 0-.538-.213Q19 12.325 19 12q0-.325.212-.537.212-.213.538-.213h2.5q.325 0 .538.213Q23 11.675 23 12q0 .325-.212.537-.212.213-.538.213ZM12 5q-.325 0-.537-.213Q11.25 4.575 11.25 4.25v-2.5q0-.325.213-.538Q11.675 1 12 1q.325 0 .537.212 .213.212 .213.538v2.5q0 .325-.213.537Q12.325 5 12 5Zm0 18q-.325 0-.537-.212-.213-.212-.213-.538v-2.5q0-.325.213-.538Q11.675 19 12 19q.325 0 .537.212 .213.212 .213.538v2.5q0 .325-.213.538Q12.325 23 12 23ZM6 7.05l-1.425-1.4q-.225-.225-.213-.537.013-.312.213-.537.225-.225.537-.225t.537.225L7.05 6q.2.225 .2.525 0 .3-.2.5-.2.225-.513.225-.312 0-.537-.2Zm12.35 12.375L16.95 18q-.2-.225-.2-.538t.225-.512q.2-.225.5-.225t.525.225l1.425 1.4q.225.225 .212.538-.012.313-.212.538-.225.225-.538.225t-.538-.225ZM16.95 7.05q-.225-.225-.225-.525 0-.3.225-.525l1.4-1.425q.225-.225.538-.213.313 .013.538 .213.225 .225.225 .537t-.225.537L18 7.05q-.2.2-.512.2-.312 0-.538-.2ZM4.575 19.425q-.225-.225-.225-.538t.225-.538L6 16.95q.225-.225.525-.225.3 0 .525.225 .225.225 .225.525 0 .3-.225.525l-1.4 1.425q-.225.225-.537.212-.312-.012-.537-.212ZM12 12Z'
  moon ='M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.2 0 .425.013 .225.013 .575.038-.9.8-1.4 1.975-.5 1.175-.5 2.475 0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.3 0 2.475-.463T20.95 11.15q.025.3 .038.488Q21 11.825 21 12q0 3.75-2.625 6.375T12 21Zm0-1.5q2.725 0 4.75-1.687t2.525-3.963q-.625.275-1.337.412Q17.225 14.4 16.5 14.4q-2.875 0-4.887-2.013T9.6 7.5q0-.6.125-1.287.125-.687.45-1.562-2.45.675-4.062 2.738Q4.5 9.45 4.5 12q0 3.125 2.188 5.313T12 19.5Zm-.1-7.425Z'

  //https://getbootstrap.com/docs/5.3/utilities/display/#hiding-elements
  myBreakpoints: {
    XSmall: boolean;
    Small: boolean;
    Medium: boolean;
    Large: boolean;
    XLarge: boolean;

    ShowXSmallUp: boolean;
    ShowSmallUp: boolean;
    ShowMediumUp: boolean;
    ShowLargeUp: boolean;
    ShowXLargeUp: boolean;

    ShowXSmallDown: boolean;
    ShowSmallDown: boolean;
    ShowMediumDown: boolean;
    ShowLargeDown: boolean;
    ShowXLargeDown: boolean;

    HideXSmallUp: boolean;
    HideSmallUp: boolean;
    HideMediumUp: boolean;
    HideLargeUp: boolean;
    HideXLargeUp: boolean;

    HideXSmallDown: boolean;
    HideSmallDown: boolean;
    HideMediumDown: boolean;
    HideLargeDown: boolean;
    HideXLargeDown: boolean;


  } = {
    XSmall: false,
    Small: false,
    Medium: false,
    Large: false,
    XLarge: false,

    ShowXSmallUp: false,
    ShowSmallUp: false,
    ShowMediumUp: false,
    ShowLargeUp: false,
    ShowXLargeUp: false,

    ShowXSmallDown: false,
    ShowSmallDown: false,
    ShowMediumDown: false, 
    ShowLargeDown: false,
    ShowXLargeDown: false,

    HideXSmallUp: false,
    HideSmallUp: false,
    HideMediumUp: false,
    HideLargeUp: false,
    HideXLargeUp: false,

    HideXSmallDown: false,
    HideSmallDown: false,
    HideMediumDown: false,
    HideLargeDown: false,
    HideXLargeDown: false,
  };

  constructor(public userService: UserService, private authService:AuthService, public responsive: BreakpointObserver) {}

  ngAfterViewInit() {
    if (this.element){
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', this.sun);
      this.element.nativeElement.querySelector('.mdc-switch__icon--off').firstChild.setAttribute('d', this.moon);
    }
  }
  changeTheme(){this.themeClass = this.theme ? 'light-theme' : 'dark-theme'; };  theme = true;


  ngOnInit(): void {
    this.authService.getCurrentUser()

    this.changeTheme();


    this.responsive
      .observe([Breakpoints.XSmall,Breakpoints.Small,Breakpoints.Medium,Breakpoints.Large,Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        const breakpoints = state.breakpoints;

        if (breakpoints[Breakpoints.XSmall]) {
          this.setMyBreakpointsToFalse();
          this.myBreakpoints.XSmall = true;

          this.myBreakpoints.ShowXSmallUp = false;
          this.myBreakpoints.ShowSmallUp = true;
          this.myBreakpoints.ShowMediumUp = true;
          this.myBreakpoints.ShowLargeUp = true;
          this.myBreakpoints.ShowXLargeUp = true;
      
          this.myBreakpoints.HideXSmallUp = true;
          this.myBreakpoints.HideSmallUp = false;
          this.myBreakpoints.HideMediumUp = false;
          this.myBreakpoints.HideLargeUp = false;
          this.myBreakpoints.HideXLargeUp = false;
      
          this.myBreakpoints.HideXSmallDown = true;
          this.myBreakpoints.HideSmallDown = true;
          this.myBreakpoints.HideMediumDown = true;
          this.myBreakpoints.HideLargeDown = true;
          this.myBreakpoints.HideXLargeDown = true;

          this.myBreakpoints.ShowXSmallDown = false;
          this.myBreakpoints.ShowSmallDown = false;
          this.myBreakpoints.ShowMediumDown = false; 
          this.myBreakpoints.ShowLargeDown = false;
          this.myBreakpoints.ShowXLargeDown = false;


                
          console.log("screens matches XSmall");
        }
        else if (breakpoints[Breakpoints.Small]) {
          this.setMyBreakpointsToFalse();
          this.myBreakpoints.Small = true;

          this.myBreakpoints.ShowXSmallUp = false;
          this.myBreakpoints.ShowSmallUp = false;
          this.myBreakpoints.ShowMediumUp = true;
          this.myBreakpoints.ShowLargeUp = true;
          this.myBreakpoints.ShowXLargeUp = true;
      
          this.myBreakpoints.HideXSmallUp = true;
          this.myBreakpoints.HideSmallUp = true;
          this.myBreakpoints.HideMediumUp = false;
          this.myBreakpoints.HideLargeUp = false;
          this.myBreakpoints.HideXLargeUp = false;
      
          this.myBreakpoints.HideXSmallDown = false;
          this.myBreakpoints.HideSmallDown = true;
          this.myBreakpoints.HideMediumDown = true;
          this.myBreakpoints.HideLargeDown = true;
          this.myBreakpoints.HideXLargeDown = true;

          this.myBreakpoints.ShowXSmallDown = true;
          this.myBreakpoints.ShowSmallDown = false;
          this.myBreakpoints.ShowMediumDown = false; 
          this.myBreakpoints.ShowLargeDown = false;
          this.myBreakpoints.ShowXLargeDown = false;

          console.log("screens matches Small");
        }
        else if (breakpoints[Breakpoints.Medium]) {
          this.setMyBreakpointsToFalse();
          this.myBreakpoints.Medium = true;

          this.myBreakpoints.ShowXSmallUp = false;
          this.myBreakpoints.ShowSmallUp = false;
          this.myBreakpoints.ShowMediumUp = false;
          this.myBreakpoints.ShowLargeUp = true;
          this.myBreakpoints.ShowXLargeUp = true;
      
          this.myBreakpoints.HideXSmallUp = true;
          this.myBreakpoints.HideSmallUp = true;
          this.myBreakpoints.HideMediumUp = true;
          this.myBreakpoints.HideLargeUp = false;
          this.myBreakpoints.HideXLargeUp = false;
      
          this.myBreakpoints.HideXSmallDown = false;
          this.myBreakpoints.HideSmallDown = false;
          this.myBreakpoints.HideMediumDown = true;
          this.myBreakpoints.HideLargeDown = true;
          this.myBreakpoints.HideXLargeDown = true;

          this.myBreakpoints.ShowXSmallDown = true;
          this.myBreakpoints.ShowSmallDown = true;
          this.myBreakpoints.ShowMediumDown = false; 
          this.myBreakpoints.ShowLargeDown = false;
          this.myBreakpoints.ShowXLargeDown = false;
          
          console.log("screens matches Medium");
        }
        else if (breakpoints[Breakpoints.Large]) {
          this.setMyBreakpointsToFalse();
          this.myBreakpoints.Large = true;

          this.myBreakpoints.ShowXSmallUp = false;
          this.myBreakpoints.ShowSmallUp = false;
          this.myBreakpoints.ShowMediumUp = false;
          this.myBreakpoints.ShowLargeUp = false;
          this.myBreakpoints.ShowXLargeUp = true;
      
          this.myBreakpoints.HideXSmallUp = true;
          this.myBreakpoints.HideSmallUp = true;
          this.myBreakpoints.HideMediumUp = true;
          this.myBreakpoints.HideLargeUp = true;
          this.myBreakpoints.HideXLargeUp = false;
      
          this.myBreakpoints.HideXSmallDown = false;
          this.myBreakpoints.HideSmallDown = false;
          this.myBreakpoints.HideMediumDown = false;
          this.myBreakpoints.HideLargeDown = true;
          this.myBreakpoints.HideXLargeDown = true;

          this.myBreakpoints.ShowXSmallDown = true;
          this.myBreakpoints.ShowSmallDown = true;
          this.myBreakpoints.ShowMediumDown = true; 
          this.myBreakpoints.ShowLargeDown = false;
          this.myBreakpoints.ShowXLargeDown = false;
          
          console.log("screens matches Large");
        }
        else if (breakpoints[Breakpoints.XLarge]) {
          this.setMyBreakpointsToFalse();
          this.myBreakpoints.XLarge = true;

          this.myBreakpoints.ShowXSmallUp = false;
          this.myBreakpoints.ShowSmallUp = false;
          this.myBreakpoints.ShowMediumUp = false;
          this.myBreakpoints.ShowLargeUp = false;
          this.myBreakpoints.ShowXLargeUp = false;
      
          this.myBreakpoints.HideXSmallUp = true;
          this.myBreakpoints.HideSmallUp = true;
          this.myBreakpoints.HideMediumUp = true;
          this.myBreakpoints.HideLargeUp = true;
          this.myBreakpoints.HideXLargeUp = false;
      
          this.myBreakpoints.HideXSmallDown = false;
          this.myBreakpoints.HideSmallDown = false;
          this.myBreakpoints.HideMediumDown = false;
          this.myBreakpoints.HideLargeDown = false;
          this.myBreakpoints.HideXLargeDown = true;

          this.myBreakpoints.ShowXSmallDown = true;
          this.myBreakpoints.ShowSmallDown = true;
          this.myBreakpoints.ShowMediumDown = true; 
          this.myBreakpoints.ShowLargeDown = true;
          this.myBreakpoints.ShowXLargeDown = false;

          console.log("screens matches XLarge");
        }else{
          console.log("no matches");
        }
        console.log(this.myBreakpoints)
      });
  }
  setMyBreakpointsToFalse(){
    this.myBreakpoints.XSmall = false;
    this.myBreakpoints.Small = false;
    this.myBreakpoints.Medium = false;
    this.myBreakpoints.Large = false;
    this.myBreakpoints.XLarge = false;

    this.myBreakpoints.ShowXSmallUp = false;
    this.myBreakpoints.ShowSmallUp = false;
    this.myBreakpoints.ShowMediumUp = false;
    this.myBreakpoints.ShowLargeUp = false;
    this.myBreakpoints.ShowXLargeUp = false;

    this.myBreakpoints.ShowXSmallDown = false;
    this.myBreakpoints.ShowSmallDown = false;
    this.myBreakpoints.ShowMediumDown = false; 
    this.myBreakpoints.ShowLargeDown = false;
    this.myBreakpoints.ShowXLargeDown = false;

    this.myBreakpoints.HideXSmallUp = false;
    this.myBreakpoints.HideSmallUp = false;
    this.myBreakpoints.HideMediumUp = false;
    this.myBreakpoints.HideLargeUp = false;
    this.myBreakpoints.HideXLargeUp = false;

    this.myBreakpoints.HideXSmallDown = false;
    this.myBreakpoints.HideSmallDown = false;
    this.myBreakpoints.HideMediumDown = false;
    this.myBreakpoints.HideLargeDown = false;
    this.myBreakpoints.HideXLargeDown = false;
  }
}
/*
		   xs s	m	l	xl	x = true, blank = false
		  -------------
s-xs-u	x	x	x	x	x	// show xsu = show mindenhol
s-s-u	  	x	x	x	x	
s-mu		  	x	x	x
s-lu			  	x	x
s-xlu				  	x

h-xs-u						// hide xsu = hide mindenhol
h-s-u	  x
h-m-u	  x	x
h-l-u	  x	x	x
h-xl-u	x	x	x	x

h-xs-d	  x	x	x	x
h-s-d			  x	x	x
h-m-d				  x	x
h-l-d					  x
h-xl-d						// hide xld = hide mindenhol

s-xs-d	x
s-s-d	  x	x
s-m-d	  x	x	x
s-l-d	  x	x	x	x
s-xl-d	x	x	x	x	x	// show xld = show mindenhol
		  -------------
		   xs s	m	l	xl

*/