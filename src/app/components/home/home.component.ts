import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BookmarkService } from '../../services/bookmark.service';
import { TaskService } from '../../services/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookmarkForm!: FormGroup;
  taskForm!: FormGroup;
  user: any;
  responseValue: any;
  bookmarks: any = [];
  tasks: any = [];
  err!: string;
  bsubmitted = false;
  tsubmitted = false;
  taskErr!: string;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private formBuilder: FormBuilder,
    private bookmarkService: BookmarkService,
    private router: Router,
    private taskService: TaskService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.ngxService.start();
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.user !== null || Object.keys(this.user).length !== 0) {
      this.bookmarkService.get(this.user.email).subscribe(
        (data) => {
          this.responseValue = data;
          if (this.responseValue.result !== 'error') {
            if (
              this.responseValue.value !== undefined &&
              this.responseValue.value.length > 0
            ) {
              this.bookmarks = this.responseValue.value;
            } else {
              this.bookmarks = [];
            }
          } else {
            this.err = this.responseValue.message;
          }
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
        }
      );
      this.taskService.get(this.user.email).subscribe(
        (data) => {
          this.responseValue = data;
          if (this.responseValue.result !== 'error') {
            if (
              this.responseValue.value !== undefined &&
              this.responseValue.value.length > 0
            ) {
              this.tasks = this.responseValue.value;
            } else {
              this.tasks = [];
            }
          } else {
            this.err = this.responseValue.message;
          }
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
        }
      );
    } else {
      this.ngxService.stop();
      this.router.navigate(['/login']);
    }

    this.clearBookmarkForm();
    this.clearTaskForm();
  }

  clearBookmarkForm() {
    this.bookmarkForm = this.formBuilder.group({
      id: [this.generateRandomId()],
      url: ['', Validators.required],
      name: ['', Validators.required],
      desc: [''],
      email: [this.user ? this.user.email : ''],
      date: [new Date()],
    });
  }

  clearTaskForm() {
    this.taskForm = this.formBuilder.group({
      id: [this.generateRandomId()],
      title: ['', Validators.required],
      description: ['', Validators.required],
      expiration: ['', Validators.required],
      email: [this.user ? this.user.email : ''],
      date: [new Date()],
      status: [true],
    });
  }

  get b() {
    return this.bookmarkForm.controls;
  }

  get t() {
    return this.taskForm.controls;
  }

  addBookmark() {
    this.bsubmitted = true;
    if (this.bookmarkForm.invalid) {
      return;
    } else {
      this.ngxService.start();
      const bookmark = this.bookmarkForm.value;
      this.bookmarkService.save(bookmark).subscribe(
        (data) => {
          this.responseValue = data;
          this.ngxService.stop();
          if (this.responseValue.result !== 'error') {
            this.clearBookmarkForm();
            this.bookmarks.unshift(bookmark);
            this.bsubmitted = false;
          } else {
            this.taskErr = this.responseValue.message;
            this.bsubmitted = false;
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
    }
  }

  addTask() {
    this.tsubmitted = true;
    if (this.taskForm.invalid) {
      return;
    } else {
      this.ngxService.start();
      const task = this.taskForm.value;
      this.taskService.save(task).subscribe(
        (data) => {
          this.responseValue = data;
          this.ngxService.stop();
          if (this.responseValue.result !== 'error') {
            this.tasks.unshift(task);
            this.clearTaskForm();
            this.tsubmitted = false;
          } else {
            this.taskErr = this.responseValue.message;
            this.tsubmitted = false;
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
    }
  }

  generateRandomId() {
    return Math.random().toString(36).substring(8);
  }

  onCheckChange(task: any, event: any) {
    task.status = !event.srcElement.checked;
    this.ngxService.start();
    this.taskService.update(task).subscribe(
      (data) => {
        this.responseValue = data;
        if (this.responseValue.result === 'error') {
          task.status = event.srcElement.checked;
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  deleteTask(task: any) {
    this.ngxService.start();
    this.taskService.delete(task).subscribe(
      (data) => {
        this.responseValue = data;
        if (this.responseValue.result !== 'error') {
          this.tasks.splice(this.tasks.indexOf(task), 1);
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  deleteBookmark(book: any) {
    this.ngxService.start();
    this.bookmarkService.delete(book).subscribe(
      (data) => {
        this.responseValue = data;
        if (this.responseValue.result !== 'error') {
          this.bookmarks.splice(this.bookmarks.indexOf(book), 1);
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  singOut() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  compareDates(dateInitial: string, dateEnd: string) {
    return Date.parse(dateInitial) <= Date.parse(dateEnd);
  }
}
