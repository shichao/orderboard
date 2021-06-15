type Order = {
  price: number;
  size: number;
};

type Message = {
  bids: Order[]; //seller orders
  asks: Order[]; //buyer orders
};
