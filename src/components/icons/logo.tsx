import Image from "next/image";

export default function LogoIcon({className}:{className?:string}) {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={40}
      height={40}
      className={className}
    />
  );
}