import RewardForm from '../../../../components/RewardForm';

interface EditRewardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRewardPage({ params }: EditRewardPageProps) {
  const { id } = await params;
  return <RewardForm rewardId={id} />;
} 