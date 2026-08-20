import { useEffect, useRef, useState, useId } from "react";

export function EmailContentRenderer({ html, className }: { html: string, className?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(100);

  // Use a unique ID for this iframe to handle messages safely
  const messageId = useId();

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'iframe-resize' && e.data.id === messageId) {
        setHeight(e.data.height);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [messageId]);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="color-scheme" content="light dark">
        <base target="_blank">
        <style>
          body { 
            margin: 0; 
            padding: 24px 32px; 
            word-wrap: break-word;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #000;
            background: transparent;
          }
          @media (prefers-color-scheme: dark) {
            html {
              background-color: transparent !important;
            }
            body {
              color: #e5e7eb;
            }
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          function reportHeight() {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: 'iframe-resize', height: height, id: '${messageId}' }, '*');
          }
          window.addEventListener('load', reportHeight);
          window.addEventListener('resize', reportHeight);
          new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
          
          document.addEventListener('click', function(e) {
            let target = e.target;
            while (target && target.tagName !== 'A') {
              target = target.parentNode;
            }
            if (target && target.tagName === 'A') {
              target.setAttribute('target', '_blank');
              target.setAttribute('rel', 'noopener noreferrer');
            }
          });
        <\/script>
      </body>
    </html>
  `;

  return (
    <div className={className || "w-full email-content"}>
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        style={{ width: '100%', height: `${height}px`, minHeight: '100px' }}
        frameBorder="0"
        scrolling="no"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
    </div>
  );
}
