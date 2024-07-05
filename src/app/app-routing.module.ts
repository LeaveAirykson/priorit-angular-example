import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookhomeComponent } from './bookhome/bookhome.component';

const routes: Routes = [
  {
    path: '',
    component: BookhomeComponent
  },
  {
    path: 'edit/:id',
    component: BookhomeComponent
  },
  {
    path: 'search',
    component: BookhomeComponent,
    data: { search: true }
  },
  {
    path: 'filter',
    component: BookhomeComponent,
    data: { filter: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
