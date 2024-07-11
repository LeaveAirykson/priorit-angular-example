import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookHomeComponent } from './book/book-home/book-home.component';

const routes: Routes = [
  {
    path: '',
    component: BookHomeComponent
  },
  {
    path: 'search',
    component: BookHomeComponent,
    data: { searched: true }
  },
  {
    path: 'filter',
    component: BookHomeComponent,
    data: { searched: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
