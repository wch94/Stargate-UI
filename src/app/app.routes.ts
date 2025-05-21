import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PeopleListComponent } from './pages/people-list/people-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'people', component: PeopleListComponent },
];
