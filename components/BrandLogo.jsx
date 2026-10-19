import Image from "next/image";

export default function BrandLogo() {
  return (
    <Image
      className="brand-logo"
      src="/assets/waraka-logo-v1.png"
      alt="WARAKA"
      width={180}
      height={60}
      sizes="(max-width: 560px) 150px, 180px"
      loading="eager"
    />
  );
}
