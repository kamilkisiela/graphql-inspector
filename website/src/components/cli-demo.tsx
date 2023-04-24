import { ReactElement } from 'react';
import mp4 from '../../public/assets/img/cli/demo.mp4';
import webm from '../../public/assets/img/cli/demo.webm';

export function CliDemo(): ReactElement {
  return (
    <video className="w-full" autoPlay loop muted>
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
