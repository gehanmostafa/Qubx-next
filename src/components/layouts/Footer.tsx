import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary text-background text-center">
      <div className="mt-4 flex flex-wrap gap-1 justify-center p-4">
        <div>
          Copyright &copy;{" "}
          <Link
            href="https://qubxview.com/"
            target="_blank"
            className="underline"
          >
            QUBX
          </Link>
          {new Date().getFullYear()} . All Rights Reserved.
        </div>
        <div className="flex items-center gap-1">
          Powered By{" "}
          <Link href="https://teqneia.com/" target="_blank" className="">
            <Image
              src="/images/teqneia_logo.svg"
              alt="teqneia logo"
              width={80}
              height={40}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
