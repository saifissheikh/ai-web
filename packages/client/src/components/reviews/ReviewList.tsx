import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { HiSparkles } from 'react-icons/hi2';
import { Button } from '../ui/button';
import ReviewSkeleton from './reviewSkeleton';
import {
  reviewsApi,
  type GetReviewsResponse,
  type SummarizeResponse,
} from './reviewsApi';

type Props = {
  productId: number;
};

const ReviewList = ({ productId }: Props) => {
  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });
  const reviewsQuery = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
  });

  if (reviewsQuery.isError) {
    return <p className="text-red-500">Could not fetch errors, try again</p>;
  }

  if (reviewsQuery.isLoading)
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );

  if (!reviewsQuery.data?.reviews.length) return null;

  const currentSummary =
    reviewsQuery.data.summary || summaryMutation?.data?.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              className="cursor-pointer"
              disabled={summaryMutation?.isPending}
              onClick={() => summaryMutation?.mutate()}
            >
              <HiSparkles /> Summarize
            </Button>
            {summaryMutation.isPending && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryMutation.isError && (
              <p className="text-red-500">
                Could not summarize, please try again
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {reviewsQuery.data?.reviews.map((review) => (
          <div key={review.id}>
            <div className="font-semibold">{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <p className="py-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
