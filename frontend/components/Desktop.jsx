import Logo from '@/public/Nutrition Scanner-Private-PNG.png';
import Image from 'next/image';
import phone from '@/public/phone.png';

const Desktop = () => {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center space-y-8">
      <Image 
        src={Logo}
        width={150}
        height={150}
        alt="Nutrition Scanner Logo"
      />
      <div className="font-Lato text-center font-normal text-3xl">Please access this site on a mobile device.</div>
      <Image 
        src={phone}
        width={100}
        height={100}
        alt="Phone Vector"
      />
    </div>
  )
}

export default Desktop;