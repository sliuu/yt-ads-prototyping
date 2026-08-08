import { CommentIcon, HeartIcon, MoreIcon } from '../../ui/icons';
import s from './ad.module.css';

/** Like / comment / more column — pure set dressing for realism. */
export function ShortsRail({ size = 26 }: { size?: number }) {
  return (
    <div className={s.rail}>
      <HeartIcon size={size} />
      <CommentIcon size={size} />
      <MoreIcon size={size} />
    </div>
  );
}
