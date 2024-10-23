import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryList } from '../interfaces/category-list';
import { WriteBlog } from '../interfaces/write-blog';
import { AuthService } from '../services/auth.service';
import { BlogService } from '../services/blog.service';
import { CategoryService } from '../services/category.service';
import { UtilsService } from '../services/utils.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.scss']
})
export class WriteBlogComponent implements OnInit {

  apiUrl;
  categoryList: CategoryList = {
    sub: null,
    error: null,
    loading: false,
    items: []
  };

  blog: WriteBlog = {
    sub: null,
    error: null,
    loading: false,
    data: {
        title: null,
        category: null,
        body: null,
        img: ''
    }
  };

  image;

  addCategoryName: string = '';
  editorContent: string = '';

  constructor(
    private _authService: AuthService,
    private _categorySerice: CategoryService,
    private _blogService: BlogService,
    private _router: Router,
    private _utils: UtilsService,
    private sanitizer: DomSanitizer
  ) { }

  get safeHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
  }

  ngOnInit(): void {
    this.getCategories();
  }

  addCategory() {
    this._categorySerice.addCategoryList(this.addCategoryName).subscribe(res => {
      console.log(res);
    });
  }

  saveBlog() {
    this.blog.loading = true;
    this.blog.error = null;

    this.blog.data = this._utils.trimObject(this.blog.data);
    const formData = new FormData();
    formData.append('title', this.blog.data.title);
    formData.append('category', this.blog.data.category);
    formData.append('body', this.blog.data.body);
    if( this.image ) {
      formData.append('img', this.image);
    }

    this.blog.sub = this._blogService.writeBlog(formData)
    .subscribe((res:any) => {

      this._router.navigate(['/blog', res._id])
      this.blog.loading = false;
      this.blog.sub.unsubscribe();

    }, err => {

      this.blog.error = err;
      this.blog.loading = false;
      this.blog.sub.unsubscribe();

    })
  }

  getCategories() {
    this.categoryList.loading = true;
    this.categoryList.error = null;

    this.categoryList.sub = this._categorySerice.getCategoryList()
    .subscribe((res: any) => {

      this.categoryList.items = res;
      this.categoryList.loading = false;
      this.categoryList.sub.unsubscribe();

    }, err => {

      this.categoryList.error = err;
      this.categoryList.loading = false;
      this.categoryList.sub.unsubscribe();

    })
  }

  fileChangeEvent(e) {
    if( e.target.files.length > 0 ) {
      this.image = e.target.files[0];

      const file = (e.target as HTMLInputElement).files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.blog.data.img = reader.result as string;
      }
      reader.readAsDataURL(file)

    }
  }

}
