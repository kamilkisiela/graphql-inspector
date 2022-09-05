import { ReactElement } from 'react';
import webm from '../../public/assets/img/cli/demo.webm';
import mp4 from '../../public/assets/img/cli/demo.mp4';

export function CliDemo(): ReactElement {
  return (
    <video className="w-full" autoPlay loop muted>
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
