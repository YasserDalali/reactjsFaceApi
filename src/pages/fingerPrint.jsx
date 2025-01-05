import * as React from 'react';
import './style.css';

// import the fingerprintjs opensource library
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * A React component that uses the FingerprintJS library
 * to generate a hash for the current browser. The hash
 * is stored in the component's state and is set as soon
 * as the component mounts.
 *
 * @return {React.ReactElement} The component.
 */
export default function FingerPrintDetection() {
  // The fingerprint can be stored in the state or
  // in the localstorage of the browser

  const [fpHash, setFpHash] = React.useState('');

  // create and set the fingerprint as soon as
  // the component mounts
  React.useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();

      const { visitorId } = await fp.get();

      setFpHash(visitorId);
    };

    setFp();
  }, []);
  return (
    <div>
      <h1>This is the fingerprint hash</h1>
      <h3>Hash: {fpHash}</h3>
    </div>
  );
}
