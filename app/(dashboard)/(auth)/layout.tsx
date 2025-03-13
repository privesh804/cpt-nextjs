import { toAbsoluteUrl } from "@/utils/assets";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-x-4 items-center h-full min-h-svh p-8 md:p-0">
        <div className="flex justify-center items-center h-full col-span-12 md:col-span-6 lg:col-span-7 md:p-4">
          {children}
        </div>

        <div className="hidden col-span-12 md:col-span-6 lg:col-span-5 md:flex w-full h-full p-8 lg:p-16">
          <div
            className="border border-primary-light p-8 flex flex-col gap-4 w-full rounded-2xl bg-contain bg-no-repeat bg-right-bottom"
            style={{
              backgroundImage: `url('/media/images/logistic-guy.jpg`,
            }}
          >
            <Link href="/">
              <Image
                src={toAbsoluteUrl("/media/app/mini-logo.svg")}
                className="h-[28px] max-w-none m-auto md:m-0"
                alt=""
                width={28}
                height={28}
              />
            </Link>

            <div className="flex flex-col gap-3 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-gray-900">
                Construction Tracking Portal
              </h3>
              <div className="text-base font-medium text-gray-600">
                A robust admin gateway ensuring
                <br /> secure&nbsp;
                <span className="text-gray-900 font-semibold">
                  efficient user access
                </span>
                &nbsp;to the
                <br /> Construction Tracking Dashboard interface.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
