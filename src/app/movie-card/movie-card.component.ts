// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';

import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  userData = { username: '', favoritemovies: [] };
  favoritemovies: any[] = [];
  // isFavoriteMovie: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUserFavorites();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.favoritemovies = this.user.favoritemovies;
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.favoritemovies = response.filter((movie: any) =>
        this.user.favoritemovies.includes(movie._id)
      );
    });
  }

  directorDialog(
    name: string,
    bio: string,
    birthyear: string,
    deathyear: string
  ): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birthyear,
        Death: deathyear,
      },
      width: '450px',
    });
  }

  genreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px',
    });
  }

  movieDescriptionDialog(description: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }

  getUserFavorites(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoritemovies = this.user.favoritemovies;
    this.favoritemovies = this.user.favoritemovies;
  }

  isFavorite(movieId: string): boolean {
    return this.favoritemovies.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    const index = this.favoritemovies.indexOf(movieId);
    if (index === -1) {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(movieId).subscribe(
        (response) => {
          this.favoritemovies.push(movieId);
          this.updateUserFavoritesLocally();
          this.snackBar.open('Added to Favorites!', 'OK', {
            duration: 2000,
          });
          console.log(this.favoritemovies);
        },
        (error) => {
          console.error('Error adding to favorites:', error);
        }
      );
    } else {
      // Remove from favorites
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(
        (response) => {
          this.favoritemovies.splice(index, 1);
          this.updateUserFavoritesLocally();
          this.snackBar.open('Removed from Favorites!', 'OK', {
            duration: 2000,
          });
          console.log(this.favoritemovies);
        },
        (error) => {
          console.error('Error removing from favorites:', error);
        }
      );
    }
  }

  updateUserFavoritesLocally(): void {
    this.user.favoritemovies = this.favoritemovies;
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}
