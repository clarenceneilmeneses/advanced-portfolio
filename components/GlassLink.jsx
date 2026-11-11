'use client';
import { Button } from 'glisse';

// A glisse glass button that goes somewhere. glisse's Button is a <button>
// (its press and refraction hooks are not exported), so the link is followed
// on click: a new tab for outside pages, the same tab for mailto: and paths.
export default function GlassLink({ href, external = false, icon, variant, className, children, ...rest }) {
  const go = () => {
    if (external) window.open(href, '_blank', 'noopener,noreferrer');
    else window.location.href = href;
  };
  return (
    <Button role="link" icon={icon} variant={variant} className={className} onClick={go}
      title={external ? `${typeof children === 'string' ? children : ''} (opens in a new tab)`.trim() : undefined}
      {...rest}>
      {children}
    </Button>
  );
}
