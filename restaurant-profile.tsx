import Image from "next/image"
import { MapPin, Clock, HelpCircle, ExternalLink } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function RestaurantProfile() {
  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JwlprrGJx2l93wF86uokhCKudJdoOe.png"
            alt="Maicha logo"
          />
        </Avatar>
        <h1 className="text-2xl font-bold">Maicha</h1>
        <p className="text-muted-foreground text-center">Lebih dari 40 Km dari lokasimu</p>
      </div>

      <Card className="mb-4">
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 flex justify-between items-start">
              <p className="text-sm">Ruko Neo Arcade C/23 Jl. CB...</p>
              <Button variant="link" className="text-red-500 px-0">
                Buka peta
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex items-center gap-2">
              <span>Sekarang</span>
              <span className="text-blue-500 font-medium">Buka</span>
              <span>, Tutup 19:00</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span>Cara order</span>
            </div>
            <Button variant="link" className="text-red-500 px-0">
              Lihat Tutorial
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="Takeaway icon"
                className="opacity-75"
              />
            </div>
            <h3 className="font-semibold">Ambil di Tempat</h3>
          </div>
        </Card>

        <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="Dine-in icon"
                className="opacity-75"
              />
            </div>
            <h3 className="font-semibold">Makan di Tempat</h3>
          </div>
        </Card>
      </div>
    </div>
  )
}

