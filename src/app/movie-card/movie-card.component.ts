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
  /**
   * Array containing movie data.
   */
  movies: any[] = [];

  /**
   * User object.
   */
  user: any = {};

  /**
   * User data including username and favorite movies.
   */
  userData = { username: '', favoritemovies: [] };

  /**
   * Array containing favorite movies.
   */
  favoritemovies: any[] = [];

  // isFavoriteMovie: boolean = false;

  /**
   * Creates an instance of MovieCardComponent.
   * @param fetchApiData - Service for API calls
   * @param dialog - Service for opening dialog components
   * @param snackBar - Service for displaying notifications
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getUserFavorites();
  }

  /**
   * Retrieves all movies from the database.
   * @returns all movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Retrieves the user profile information.
   * @returns user data
   */
  getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.favoritemovies = this.user.favoritemovies;
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.favoritemovies = response.filter((movie: any) =>
        this.user.favoritemovies.includes(movie._id)
      );
    });
  }

  /**
   * Opens a dialog displaying director information.
   * @param name - Director's name
   * @param bio - Director's biography
   * @param birthyear - Director's birth year
   * @param deathyear - Director's death year (if applicable)
   */
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

  /**
   * Opens a dialog displaying genre information.
   * @param name - Genre name
   * @param description - Genre description
   */
  genreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px',
    });
  }

  /**
   * Opens a dialog displaying movie description.
   * @param description - Movie description
   */
  movieDescriptionDialog(description: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }

  /**
   * Retrieves user favorites.
   * @returns user favorite movies
   */
  getUserFavorites(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoritemovies = this.user.favoritemovies;
    this.favoritemovies = this.user.favoritemovies;
  }

  /**
   * Checks if a movie is marked as favorite by the user.
   * @param movieId - ID of the movie
   * @returns - True if the movie is a favorite, false otherwise
   */
  isFavorite(movieId: string): boolean {
    return this.favoritemovies.includes(movieId);
  }

  /**
   * Toggles a movie between favorite and non-favorite status.
   * @param movieId - ID of the movie
   */
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

  /**
   * Updates user favorites locally.
   */
  updateUserFavoritesLocally(): void {
    this.user.favoritemovies = this.favoritemovies;
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}
