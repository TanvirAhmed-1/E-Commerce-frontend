const basketBallLinks = [
  {
    name: "Basketball Jersey",
    route: "/products",
  },
  {
    name: "Basketball Uniform",
    route: "/products",
  },
  {
    name: "Basketball Tracksuit",
    route: "/products",
  },
  {
    name: "Basketball Hoodie",
    route: "/products",
  },
  {
    name: "Basketball Jacket",
    route: "/products",
  },
];

const baseBallLinks = [
  {
    name: "Baseball Jersey",
    route: "/products",
  },
  {
    name: "Baseball Uniform",
    route: "/products",
  },
  {
    name: "Baseball Tracksuit",
    route: "/products",
  },
  {
    name: "Baseball Hoodie",
    route: "/products",
  },
  {
    name: "Baseball Jacket",
    route: "/products",
  },
];

const cricketLinks = [
  {
    name: "Cricket Jersey",
    route: "/products",
  },
  {
    name: "Cricket Uniform",
    route: "/products",
  },
  {
    name: "Cricket Cap",
    route: "/products",
  },
  {
    name: "Cricket Tracksuit",
    route: "/products",
  },
  {
    name: "Cricket Hoodie",
    route: "/products",
  },
  {
    name: "Cricket Jacket",
    route: "/products",
  },
];

const soccerLinks = [
  {
    name: "Soccer Jersey",
    route: "/products",
  },
  {
    name: "Soccer Uniform",
    route: "/products",
  },
  {
    name: "Soccer Bibs",
    route: "/products",
  },
  {
    name: "Drawstring Bag",
    route: "/products",
  },
  {
    name: "Soccer Tracksuits",
    route: "/products",
  },
  {
    name: "Soccer Jackets",
    route: "/products",
  },
  {
    name: "Soccer Hoodie",
    route: "/products",
  },
];

const footballLinks = [
  {
    name: "Football Jersey",
    route: "/products",
  },
  {
    name: "Football Uniform",
    route: "/products",
  },
  {
    name: "Football Bibs",
    route: "/products",
  },
  {
    name: "Football Tracksuits",
    route: "/products",
  },
  {
    name: "Football Hoodie",
    route: "/products",
  },
  {
    name: "Football Jackets",
    route: "/products",
  },
];

const volleyBallLinks = [
  {
    name: "Volleyball Jersey",
    route: "/products",
  },
  {
    name: "Volleyball Uniform",
    route: "/products",
  },
  {
    name: "Volleyball Hoodie",
    route: "/products",
  },
  {
    name: "Volleyball Tracksuit",
    route: "/products",
  },
  {
    name: "Volleyball Jacket",
    route: "/products",
  },
];

const otherLinks = [
  {
    name: "Polo Tshirt",
    route: "/products",
  },
  {
    name: "Tank Top",
    route: "/products",
  },
  {
    name: "Mens Shirt",
    route: "/products",
  },
  {
    name: "Esports Jersey",
    route: "/products",
  },
  {
    name: "Event Tshirt",
    route: "/products",
  },
  {
    name: "Sweatshirts",
    route: "/products",
  },
  {
    name: "Trousers",
    route: "/products",
  },
  {
    name: "Tote Bags",
    route: "/products",
  },
  {
    name: "Water Bottle",
    route: "/products",
  },
  {
    name: "Cushion Covers",
    route: "/products",
  },
];

export const subLinks = [
  {
    category: `Basketball`,
    links: basketBallLinks,
  },
  {
    category: "Baseball",
    links: baseBallLinks,
  },
  {
    category: "Cricket",
    links: cricketLinks,
  },
  {
    category: "Soccer",
    links: soccerLinks,
  },
  {
    category: "Football",
    links: footballLinks,
  },
  {
    category: "Volleyball",
    links: volleyBallLinks,
  },
  {
    category: "Others",
    links: otherLinks,
  },
];

export const navLinks = [
  {
    name: "Cricket",
    route: "/products",
    hasSubmenu: true,
    subLinks: cricketLinks,
  },
  {
    name: "Football",
    route: "/products",
    hasSubmenu: true,
    subLinks: footballLinks,
  },
  {
    name: "Basketball",
    route: "/products",
    hasSubmenu: true,
    subLinks: basketBallLinks,
  },
  {
    name: "Soccer",
    route: "/products",
    hasSubmenu: true,
    subLinks: soccerLinks,
  },
];
