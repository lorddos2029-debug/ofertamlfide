const BASE = "https://mercadopneusml.online/ml/aros";

export interface TireProduct {
  slug: string; // e.g. "15580r13"
  size: string; // e.g. "155/80 R13"
  aro: number;
  price: number;
  originalPrice: number;
  parcela12x: string;
  image: string; // listing image
  detailImages: string[]; // carousel images on detail page
}

export interface AroData {
  aro: number;
  products: TireProduct[];
  bannerImage: string;
}

function makeTire(aro: number, size: string, slug: string, parcela: string): TireProduct {
  const imgCode = size.replace("/", "").replace(" ", "").toUpperCase();
  return {
    slug,
    size,
    aro,
    price: 109.90,
    originalPrice: 145.90,
    parcela12x: parcela,
    image: `${BASE}/aro${aro}/images/${imgCode}.png`,
    detailImages: [
      `${BASE}/aro${aro}/images/${imgCode}.png`,
      `${BASE}/aro${aro}/${slug}/images/pneu1.png`,
      `${BASE}/aro${aro}/${slug}/images/pneu2.png`,
      `${BASE}/aro${aro}/${slug}/images/pneu3.png`,
      `${BASE}/aro${aro}/${slug}/images/pneu4.png`,
    ],
  };
}

export const arosData: AroData[] = [
  {
    aro: 13,
    bannerImage: `${BASE}/aro13/images/bannermion.jpeg`,
    products: [
      makeTire(13, "155/80 R13", "15580r13", "10,12"),
      makeTire(13, "155/75 R13", "15575r13", "10,12"),
      makeTire(13, "165/80 R13", "16580r13", "9,15"),
      makeTire(13, "165/70 R13", "16570r13", "9,15"),
      makeTire(13, "175/70 R13", "17570r13", "9,15"),
      makeTire(13, "175/65 R13", "17565r13", "9,15"),
      makeTire(13, "185/70 R13", "18570r13", "9,15"),
      makeTire(13, "185/65 R13", "18565r13", "9,15"),
      makeTire(13, "145/80 R13", "14580r13", "9,15"),
      makeTire(13, "145/70 R13", "14570r13", "11,20"),
      
    ],
  },
  {
    aro: 14,
    bannerImage: `${BASE}/aro14/images/bannermion.jpeg`,
    products: [
      makeTire(14, "175/70 R14", "17570r14", "10,12"),
      makeTire(14, "175/65 R14", "17565r14", "10,12"),
      makeTire(14, "185/70 R14", "18570r14", "9,15"),
      makeTire(14, "185/65 R14", "18565r14", "9,15"),
      makeTire(14, "195/70 R14", "19570r14", "9,15"),
      makeTire(14, "195/65 R14", "19565r14", "9,15"),
      makeTire(14, "155/80 R14", "15580r14", "9,15"),
      makeTire(14, "165/70 R14", "16570r14", "9,15"),
      makeTire(14, "165/65 R14", "16565r14", "9,15"),
      makeTire(14, "185/60 R14", "18560r14", "11,20"),
    ],
  },
  {
    aro: 15,
    bannerImage: `${BASE}/aro15/images/bannermion.jpeg`,
    products: [
      makeTire(15, "175/65 R15", "17565r15", "10,12"),
      makeTire(15, "185/65 R15", "18565r15", "10,12"),
      makeTire(15, "195/55 R15", "19555r15", "9,15"),
      makeTire(15, "195/60 R15", "19560r15", "9,15"),
      makeTire(15, "195/65 R15", "19565r15", "9,15"),
      makeTire(15, "205/60 R15", "20560r15", "9,15"),
      makeTire(15, "205/55 R15", "20555r15", "9,15"),
      makeTire(15, "185/60 R15", "18560r15", "9,15"),
      makeTire(15, "205/65 R15", "20565r15", "9,15"),
      makeTire(15, "215/60 R15", "21560r15", "11,20"),
    ],
  },
  {
    aro: 16,
    bannerImage: `${BASE}/aro16/images/bannermion.jpeg`,
    products: [
      makeTire(16, "195/55 R16", "19555r16", "10,12"),
      makeTire(16, "205/55 R16", "20555r16", "10,12"),
      makeTire(16, "205/60 R16", "20560r16", "9,15"),
      makeTire(16, "215/55 R16", "21555r16", "9,15"),
      makeTire(16, "215/60 R16", "21560r16", "9,15"),
      makeTire(16, "205/50 R16", "20550r16", "9,15"),
      makeTire(16, "225/55 R16", "22555r16", "9,15"),
      makeTire(16, "225/50 R16", "22550r16", "9,15"),
      makeTire(16, "235/60 R16", "23560r16", "9,15"),
      makeTire(16, "195/60 R16", "19560r16", "11,20"),
    ],
  },
  {
    aro: 17,
    bannerImage: `${BASE}/aro17/images/bannermion.jpeg`,
    products: [
      makeTire(17, "205/50 R17", "20550r17", "10,12"),
      makeTire(17, "215/45 R17", "21545r17", "10,12"),
      makeTire(17, "215/50 R17", "21550r17", "9,15"),
      makeTire(17, "225/45 R17", "22545r17", "9,15"),
      makeTire(17, "225/50 R17", "22550r17", "9,15"),
      makeTire(17, "235/45 R17", "23545r17", "9,15"),
      makeTire(17, "235/40 R17", "23540r17", "9,15"),
      makeTire(17, "245/45 R17", "24545r17", "9,15"),
      makeTire(17, "215/55 R17", "21555r17", "9,15"),
      makeTire(17, "245/40 R17", "24540r17", "11,20"),
    ],
  },
  {
    aro: 18,
    bannerImage: `${BASE}/aro18/images/bannermion.jpeg`,
    products: [
      makeTire(18, "215/45 R18", "21545r18", "10,12"),
      makeTire(18, "225/40 R18", "22540r18", "10,12"),
      makeTire(18, "225/45 R18", "22545r18", "9,15"),
      makeTire(18, "235/40 R18", "23540r18", "9,15"),
      makeTire(18, "235/45 R18", "23545r18", "9,15"),
      makeTire(18, "245/40 R18", "24540r18", "9,15"),
      makeTire(18, "245/45 R18", "24545r18", "9,15"),
      makeTire(18, "255/40 R18", "25540r18", "9,15"),
      makeTire(18, "225/50 R18", "22550r18", "9,15"),
      makeTire(18, "255/45 R18", "25545r18", "11,20"),
    ],
  },
];

export const reviews = [
  {
    name: "Natália Ibrahim",
    rating: 4,
    time: "a 18 horas atrás",
    text: "Gostei da qualidade e a entrega foi cumprida! Agora é aproveitar!!!",
    useful: 5,
  },
  {
    name: "José Oliveira",
    rating: 5,
    time: "a 1 dia atrás",
    text: "Super recomendo a compra veio tudo certo, Entrega super rápida, só instalar. Atendimento incrível e entrega rápida. Estou muito satisfeito!",
    useful: 16,
  },
  {
    name: "Paulo Brossi",
    rating: 5,
    time: "a 1 dia atrás",
    text: "Gostei do pneu, chegou antes do prazo, bem embalado, gostei vou comprar mais dois.",
    useful: 15,
  },
  {
    name: "Henrique Paulo",
    rating: 5,
    time: "a 1 dia atrás",
    text: "Pneus entregues e foi até rápido pra chegar, aparentemente de boa qualidade. Instalar pra ver o resultado rodando no carro.",
    useful: 3,
  },
  {
    name: "Felipe Alves",
    rating: 5,
    time: "a 1 dia atrás",
    text: "Podem comprar sem medo chegou no prazo ótimo produto com certeza comprarei outras vezes",
    useful: 10,
  },
  {
    name: "Eliseias Cruz",
    rating: 5,
    time: "a 1 dia atrás",
    text: "Pneus chegaram bem embalados, são de boa qualidade. Já fiz a montagem dos mesmos e não apresentou nenhum defeito. Indico a compra do produto. Chegou antes da data prevista.",
    useful: 8,
  },
];

export function getAroData(aroNum: number): AroData | undefined {
  return arosData.find((a) => a.aro === aroNum);
}

export function getTireProduct(aroNum: number, slug: string): TireProduct | undefined {
  const aro = getAroData(aroNum);
  return aro?.products.find((p) => p.slug === slug);
}
