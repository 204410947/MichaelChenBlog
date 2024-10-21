import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private _http: HttpClient,
    private _errorService: ErrorService
  ) { }

  getCategoryList() {
    return this._http.get(`${environment.apiUrl}/category`)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }

  addCategoryList(name : string): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/category`, {name: name})
    .pipe(
      catchError(err => this._errorService.handleError(err))
    );
  }

  getCategorizedBlogCount(bloggerId = 'all') {
    return this._http.get(`${environment.apiUrl}/category/categorizedBlogs/${bloggerId}`)
    .pipe(
      catchError(err => this._errorService.handleError(err))
    )
  }
}
