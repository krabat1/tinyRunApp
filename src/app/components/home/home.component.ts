import { Component } from '@angular/core';
import { SigninComponent } from '../auth/signin/signin.component';
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [SigninComponent]
})
export class HomeComponent {

}
