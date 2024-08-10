import type { NextPage } from "next";
import { useEffect, useState } from "react";
import ItemCard, { ItemCardProps } from "./component/ItemCard";
import { supabase } from "../lib/clients";

const Home: NextPage = () => {
  const [items, setItems] = useState<ItemCardProps[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("travlrd")
        .select("title, image, short_description");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setItems(data || []);
      }
    }

    fetchItems();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <ItemCard
          key={index}
          title={item.title}
          image={item.image}
          short_description={item.short_description}
        />
      ))}
    </div>
  );
};

export default Home;
