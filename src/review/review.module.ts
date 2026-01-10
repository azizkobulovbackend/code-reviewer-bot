import { Module } from '@nestjs/common';
import { AiReviewService } from './ai-review.service';
import { ReviewService } from './review.service';

@Module({
  providers: [ReviewService, AiReviewService],
  exports: [ReviewService, AiReviewService],
})
export class ReviewModule {}
