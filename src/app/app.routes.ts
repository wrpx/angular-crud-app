import { Routes } from '@angular/router';
import { UsersListComponent } from './features/users/pages/users-list/users-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersListComponent }
];
