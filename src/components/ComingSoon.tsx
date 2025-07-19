import images from "https://react-coming-soon.maksv.me/default-image.jpeg";
import ComingSoon from 'react-coming-soon'


export default function ComingSoon() {
  return (
    <ComingSoon
    image={images}
    bgColor="#fff"
    textColor="#000"
    illustration="/uc.svg"
  />
  );
}