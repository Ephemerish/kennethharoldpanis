import { Button } from "../../../components/button";
import * as Avatar from "@radix-ui/react-avatar";

export default function Header() {
  return (
    <header className="w-full py-12 md:py-24 lg:py-32 border-b">
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
                  src="https://scontent.fceb2-2.fna.fbcdn.net/v/t39.30808-6/480159326_1121614799701323_614920794384842799_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE-akOxhR_uels_x_5gbU2BYaO-m0IccUZho76bQhxxRuWQyz3xDRG57-saVe5srfUTNpdoDrIf73OMbrg0DTgR&_nc_ohc=AW5v0JUuRf0Q7kNvgFBBlet&_nc_oc=Adi-JTgJX4zBHyU6MDOX97-jMJcpTn5OtwvJdudeK6k03eO2HBYCfG8LZM9ZPpH_aCM&_nc_zt=23&_nc_ht=scontent.fceb2-2.fna&_nc_gid=A4JyQZ0uMWqANYWkvXViv-J&oh=00_AYAtnr7TtA64XwpwShqS5hZVEFik8eJINmNL6SCcYEOYcg&oe=67C89A1C"
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
    </header>
  );
}
