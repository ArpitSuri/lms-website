import Image from "next/image";

const Logo = () => {
    return ( 
     <Image 
     width={80}
     height={80}
    alt="logo"
    src='/logo.svg'
     />
     );
}
 
export default Logo;