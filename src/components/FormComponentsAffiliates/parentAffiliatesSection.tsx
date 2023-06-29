import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { affiliatesAtom } from '../../atoms/atoms';
import { Affiliates } from '../typeDefs';
const { v4: uuidv4 } = require('uuid');

const ParentAffiliateSection = (props: any) => {
  const [affiliateSettings, setAffiliateSettings] = useRecoilState(affiliatesAtom);
  const showPreferences = affiliateSettings.showAffiliatesLinks ? affiliateSettings.showAffiliatesLinks : false;

  const togglePreferences = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setAffiliateSettings((prev: Affiliates) => ({
      ...prev,
      showAffiliatesLinks: !prev.showAffiliatesLinks,
    }));
  }
  return (
    <div style={{ borderTop: 'none', borderBottom: 'none', margin: '0rem', maxWidth: '20rem', alignSelf: 'center'}}>
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'flexbox', textAlign: 'left', margin: '0rem' }}>
          <a
            href="#"
            onClick={togglePreferences}
            style={{
              color: showPreferences ? '#FC4869':'grey',  
              cursor: 'pointer',
              textDecoration: 'none',
              width: '100%',
              textDecorationLine: showPreferences ? 'underline': 'none',

            }}
          >
            {showPreferences ? 'collapse partner links' : 'partner links'}
          </a>
        </div>
        {showPreferences && (
          <div>
            {/* <div data-vi-partner-id="P00107668" data-vi-widget-ref="W-8277e1bf-c7b3-4515-a7e8-db4561cf6a8a" /> */}
            <p>Affiliate Partner Links: Support Us by Using Our Commissioned Affiliate Links</p>
           <div>
            <a href="https://www.viator.com/?pid=P00107668&mcid=42383&medium=link&campaign=itinaruPartnerLink">guided experiences</a>
           </div>
           <div>
            <a href="https://www.kqzyfj.com/click-100866862-10583406">travel insurance</a>
           </div>
           <div>
            <a href="https://www.kqzyfj.com/click-100866862-12521347">discounts on travel and attractions</a>
           </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentAffiliateSection;
