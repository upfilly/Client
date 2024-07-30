import { useEffect } from 'react';

const useReferralTracking = (cid) => {
    window.fpr = window.fpr || function () {
      window.fpr.q = window.fpr.q || [];
      window.fpr.q[arguments[0] === 'set' ? 'unshift' : 'push'](arguments);
    };

    window.fpr("init", { cid });

    window.fpr("click");

    return () => {
    };
};

export default useReferralTracking;
