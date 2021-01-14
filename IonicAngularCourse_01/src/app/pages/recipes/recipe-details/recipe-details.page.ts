import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { RecipesService } from '../../../services/recipes/recipes.service';

import { IRecipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit {
  public recipe: IRecipe;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('id')) {
        this.router.navigate(['/recipes']);

        return;
      }

      const id: string = paramMap.get('id');
      this.recipe = this.recipesService.getRecipe(id);
    });
  }

  public onDeleteRecipe() {
    this.alertController.create({
      header: 'Delete?',
      message: 'Are you sure you want to delete this recipe?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.recipesService.deleteRecipe(this.recipe.id);
            this.router.navigate(['/recipes']);
          }
        }
      ]
    }).then(alert => alert.present());
  }

}
