import { useEffect, useRef } from 'react';

const KlarnaWidget = ({ htmlSnippet }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (htmlSnippet && widgetRef.current) {
      widgetRef.current.innerHTML = htmlSnippet;

      // Dynamically evaluate any scripts included in the HTML snippet
      const scripts = widgetRef.current.getElementsByTagName('script');
      for (const script of scripts) {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        newScript.async = true;
        document.body.appendChild(newScript);
      }
    }
  }, [htmlSnippet]);

  return <div ref={widgetRef}></div>;
};

export default KlarnaWidget;
