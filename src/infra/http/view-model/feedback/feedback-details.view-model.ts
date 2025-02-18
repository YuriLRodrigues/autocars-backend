import { FeedbackDetails } from '@root/domain/enterprise/value-object/feedback-details';

export class FeedbackDetailsViewModel {
  static toHttp(feedback: FeedbackDetails) {
    return {
      id: feedback.id.toValue(),
      user: {
        id: feedback.user.id.toValue(),
        name: feedback.user.name,
        avatar: feedback.user.avatar,
        blurHash: feedback.user.blurHash,
      },
      createdAt: feedback.createdAt,
      stars: feedback.stars,
      comment: feedback.comment,
      totalLikes: feedback.totalLikes,
      title: feedback.title,
    };
  }
}
