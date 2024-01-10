import dynamic from 'next/dynamic';

const DynamicFontAwesomeIcon = dynamic(
  () => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon),
  { ssr: false }
);

export default DynamicFontAwesomeIcon;
