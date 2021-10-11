import dynamic from 'next/dynamic';
import styles from './live.module.css';

const LiveContent = dynamic(() => import('../components/live-content'), {
  ssr: false,
});

export const Live = () => {
  return (
    <div className={styles.live}>
      <div className={styles.liveContent}>
        <LiveContent />
      </div>
    </div>
  );
};
