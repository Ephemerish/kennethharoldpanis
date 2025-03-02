import { Button } from "../../../components/button";
import * as Avatar from "@radix-ui/react-avatar";

export default function Header() {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32 border-b">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_450px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Hi, I'm <span className="text-primary">Kenneth</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                I'm a passionate developer/designer with expertise in creating
                beautiful and functional web experiences. I love solving complex
                problems and turning ideas into reality.
              </p>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Welcome to my portfolio where I showcase my projects and share
                my thoughts on technology, design, and more.
              </p>
            </div>
            <div>
              <Button size="lg" className="mt-4" variant={"outline"}>
                Contact Me
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] overflow-hidden rounded-full border-4 border-primary">
              <Avatar.Root className="w-full h-full">
                <Avatar.Image
                  src="https://media.licdn.com/dms/image/v2/D5603AQGUIyi19V4Nug/profile-displayphoto-shrink_800_800/B56ZOZH25sGwAc-/0/1733440796303?e=1746662400&v=beta&t=X-dP5TLV04R_pmoFTmA2DuQrllSTEvDCjHAEiPsDaH8"
                  alt="Kenneth Harold Panis"
                  className="w-full h-full object-cover"
                />
                <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-200">
                  KH
                </Avatar.Fallback>
              </Avatar.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
