import type { Product } from "../../lib/products";

export const productFixture: Product = {
  id: "1",
  name: "Energy saving light bulb",
  power: "25W",
  description:
    "Available in 7 watts, 9 watts, 11 watts Spiral Light bulb in B22, bulb switches on instantly, no wait around warm start and flicker free features make for a great all purpose bulb",
  price: 1299,
  quantity: 2,
  brand: "Philips",
  weight: 77,
  height: 12.6,
  width: 6.2,
  length: 6.2,
  model_code: "E27 ES",
  colour: "Cool daylight",
  img_url: "https://i.ibb.co/2nzwxnQ/bulb.png",
};

export const productFixtures: Product[] = [
  productFixture,
  {
    ...productFixture,
    id: "2",
    name: "Headset",
    brand: "AudioCo",
    img_url: "https://i.pinimg.com/736x/a8/33/7f/a8337f50ffaf22a9f4c350ed63362ec8.jpg",
  },
  {
    ...productFixture,
    id: "3",
    name: "Cables",
    brand: "Connect",
    quantity: 0,
    price: 899,
    img_url: "https://i.pinimg.com/1200x/a8/7d/b4/a87db4dba18dff8ad4c3a18358b0d485.jpg",
  },
];