'use client';

import { redeemReward } from '@/actions/reward';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface Props {
  rewardId: string;
  disabled: boolean;
}

interface RedeemState {
  success: boolean;
  error?: string;
}

const initialState: RedeemState = { success: false };

export default function RedeemButton({ rewardId, disabled }: Props) {
  const [state, formAction, pending] = useActionState(
    async (_prev: RedeemState, formData: FormData): Promise<RedeemState> => {
      const result = await redeemReward(formData);
      return result;
    },
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success('Reward berhasil ditukar!');
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="rewardId" value={rewardId} />
      <button
        type="submit"
        disabled={disabled || pending}
        className="clay-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Memproses...' : disabled ? 'Poin Tidak Cukup' : '🔄 Tukar Reward'}
      </button>
    </form>
  );
}
