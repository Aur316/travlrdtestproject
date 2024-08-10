import React from "react";
import { Card, CardHeader, Image } from "@nextui-org/react";

export interface ItemCardProps {
  title: string;
  image: string;
  short_description: string;
}

export default function ItemCard({
  title,
  image,
  short_description,
}: ItemCardProps) {
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100">
      <CardHeader className="flex flex-col items-center justify-center text-center p-4">
        <Image
          alt="Card image"
          className="rounded-full shadow-lg mb-4 transition-transform transform hover:scale-110 object-cover"
          src={image}
          width={120}
          height={120}
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-custom">
          {title}
        </h3>
        <p className="text-gray-600 font-custom">{short_description}</p>
      </CardHeader>
    </Card>
  );
}
