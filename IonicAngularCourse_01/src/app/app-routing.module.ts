import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'recipes',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/recipes/recipes.module').then(m => m.RecipesPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./pages/recipes/recipe-details/recipe-details.module').then(m => m.RecipeDetailsPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
