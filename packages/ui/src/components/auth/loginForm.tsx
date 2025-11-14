import { Button, Input, Logo } from "@nuge/ui";
import Image from "next/image";

export function LoginForm() {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-12 overflow-hidden flex flex-col items-center gap-4">
      <div className="w-full flex justify-center items-center flex-col">
        <Logo bodyColor="#AB82EC" eyeColor="#F2F2F2" className="mb-6 sm:mb-8" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-12">
          Let&apos;s Get You In!
        </h1>
        <div className="w-full flex flex-col gap-2 ">
          <Button
            variant="outline"
            className="w-full h-12 sm:h-14 text-sm sm:text-base bg-background hover:bg-gray-50 border-2 flex items-center gap-3"
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
        </div>
      </div>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-500"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-gray-500 font-normal text-sm">
            or
          </span>
        </div>
      </div>
      <form className="w-full flex flex-col gap-3 sm:gap-4">
      <input
        type="email"
        placeholder="Enter email address"
        required
        autoComplete="email"
        className="w-full h-12 sm:h-14 px-4 text-sm sm:text-base bg-red-600 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      </form>
    </div>
  );
}
