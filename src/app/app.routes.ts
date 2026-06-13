import { Routes } from '@angular/router';

import { SignupComponent } from './pages/signup/signup.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { ProductsComponent } from './pages/products/products.component';


import {

  RawMaterialsComponent

} from './pages/raw-materials/raw-materials.component';

import {

  TrackRecordsComponent

} from './pages/track-records/track-records';

export const routes: Routes = [

  {
    path: '',
    component: SignupComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
  path: 'products',
  component: ProductsComponent
},

{

  path: 'raw-materials',

  component: RawMaterialsComponent

},

{

  path: 'track-records',

  component: TrackRecordsComponent

}

];