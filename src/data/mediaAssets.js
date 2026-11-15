/**
 * Registro centralizado de recursos multimedia generados localmente.
 * Vite empaqueta estas importaciones tanto en desarrollo como en producción (dist/).
 */

import logoAutomateWebs from '../assets/images/logo_automate_webs_1794767890955.jpg';
import slideWeb from '../assets/images/slide_web_engineering_1794767893130.jpg';
import slideRpa from '../assets/images/slide_rpa_automation_1794767892961.jpg';
import slideCloud from '../assets/images/slide_cloud_security_1794767893381.jpg';
import slideEcommerce from '../assets/images/slide_ecommerce_payments_1794767894515.jpg';
import slideAi from '../assets/images/slide_ai_consulting_1794767893799.jpg';
import devOne from '../assets/images/dev_profile_one_1794767893652.jpg';
import devTwo from '../assets/images/dev_profile_two_1794767894082.jpg';
import devThree from '../assets/images/dev_profile_three_1794767895283.jpg';

export const MEDIA_ASSETS = {
  logo: logoAutomateWebs,
  slide_web: slideWeb,
  slide_rpa: slideRpa,
  slide_cloud: slideCloud,
  slide_ecommerce: slideEcommerce,
  slide_ai: slideAi,
  dev_1: devOne,
  dev_2: devTwo,
  dev_3: devThree,
};

export function resolveMediaAsset(keyOrUrl, fallbackKey = 'slide_web') {
  if (!keyOrUrl) return MEDIA_ASSETS[fallbackKey];
  if (MEDIA_ASSETS[keyOrUrl]) return MEDIA_ASSETS[keyOrUrl];
  if (typeof keyOrUrl === 'string' && (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://') || keyOrUrl.startsWith('/'))) {
    return keyOrUrl;
  }
  return MEDIA_ASSETS[fallbackKey];
}
