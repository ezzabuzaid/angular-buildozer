import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { Constants } from '@core/constants';
import { PageNotFoundComponent } from './pages/static/page-not-found/page-not-found.component';

const routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Constants.Routing.HOME.withSlash,
  },
  {
    path: Constants.Routing.Portal.withoutSlash,
    loadChildren: () => import('./pages/portal/portal.module').then(({ PortalModule }) => PortalModule)
  },
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(({ LayoutModule }) => LayoutModule)
  },
  {
    path: Constants.Routing.NOT_FOUND.withoutSlash,
    component: PageNotFoundComponent
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
