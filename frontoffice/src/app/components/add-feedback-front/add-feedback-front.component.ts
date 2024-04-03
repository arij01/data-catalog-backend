import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedbacks, FeedbackGiven, StatusGiven } from 'src/app/models/Feedback';
import { FeedbacksService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-add-feedback-front',
  templateUrl: './add-feedback-front.component.html',
  styleUrls: ['./add-feedback-front.component.css']
})
export class AddFeedbackFrontComponent {

  feedback: Feedbacks = new Feedbacks();
  feedbackOptions: string[] = Object.values(FeedbackGiven);
  statusOptions: string[] = Object.values(StatusGiven); 
  datasetId: number = -1; 
  datasetName: string = '';

  constructor(
    private feedbacksService: FeedbacksService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe 
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.datasetId = params['id']; // Retrieve the dataset ID from the URL parameters
    });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      const state = navigation.extras.state;
      if (state['datasetId'] && state['datasetName']) {
        this.feedback.datasetAssocie = state['datasetName'];
        this.datasetId = state['datasetId'];
      }
    }

    this.setCurrentDate(); 
  }

  setCurrentDate() {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (formattedDate) {
      this.feedback.date = new Date(formattedDate);
    } else {
      console.error('formattedDate is null. Date could not be set.');
    }
  }

  add(f: NgForm) {
    if (this.datasetId !== undefined) {
      this.feedback.datasetAssocie = this.datasetId.toString();

      this.feedbacksService.addFeedbacks(this.feedback).subscribe({
        next: () => {
          console.log("Feedback added successfully!");
        this.router.navigate(['/datasets'])
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error("Dataset ID is undefined.");
      // Handle the case where datasetId is undefined
    }
  }
}

