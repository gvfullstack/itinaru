import {atom} from 'recoil';
import { BrandPageRender, AuthenticatedUser,PrivacySettings} from '@/components/typeDefs'


export const brandPageRender = atom<BrandPageRender>({
  key: 'brandPageRender', 
  default: {
    animationComplete: false
  }
});

////////auth state////////

export const authUserState = atom<AuthenticatedUser | null>({
  key: 'authState',
  default: null,
});

export const privacySettingsState = atom<PrivacySettings | null>({
  key: 'privacySettingsState',
  default: null,
});


