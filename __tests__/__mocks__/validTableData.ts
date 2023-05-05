import { TableOptions } from "../../src/tableTypes";

export const validTableOptions: TableOptions = {
  optionChecks: "error",
  cellPadding: 1,
  maxColumns: 6,
  maxRows: 8,
  maxColWidths: [20, 20, 60],
  maxRowHeight: 2,
  topAndBottomBorder: false,
  header: true,
  colors: {
    borderColor: "yellow",
    alternateRows: ["red", "blue"],
    customColors: [
      {
        column: 0,
        row: 0,
        fgColor: "orange",
        style: "bold",
        bgColor: "magenta",
      },
      {
        column: 2,
        row: 1,
        style: "italic",
        fgColor: "magentaBright",
        bgColor: "yellowBright",
      },
    ],
  },
  borders: {
    horizontalLine: "─",
    verticalLine: "│",
    topLeftCorner: "╭",
    topRightCorner: "╮",
    bottomLeftCorner: "╰",
    bottomRightCorner: "╯",
    topSeparator: "┬",
    bottomSeparator: "┴",
  },
};

export const validCellPaddings = [0, 1, 3, 7, 15, 20];
export const validMaxColumns = [1, 3, 10, 55, 100];
export const validMaxRows = [1, 10, 100, 500, 1000];
export const validMaxColWidths = [
  1,
  10,
  100,
  400,
  [1],
  [1, 2, 3],
  [1, 10, 100, 400],
];
export const validMaxRowHeight = [1, 7, 25, 50];

export const validTableData = [
  [
    "88fb3ba4-d3d4-48ff-b3a3-15f07fc9aa3b",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/973.jpg",
    "🦵🏾",
    "🐪🕊️🧨",
    "female",
    "Nancy",
    "Walker",
    "Nancy.Walker47@hotmail.com",
    "business",
  ],
  [
    "88fb3ba4-d3d4-48ff-b3a3-15f07fc9aa3b",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1041.jpg",
    "🤛🏾",
    "💜😜🏘️",
    "male",
    "Troy",
    "Gorczany",
    "Troy_Gorczany@hotmail.com",
    "free",
  ],
  [
    "572f0128-5e5c-4101-a346-b12a72c22843",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/209.jpg",
    "🚜",
    "🍪✍🏽🇺🇾",
    "female",
    "Lula",
    "Stanton",
    "Lula61@gmail.com",
    "basic",
  ],
  [
    "d17b6514-ffa8-4ddc-b199-b35a2ba423e6",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1109.jpg",
    "🌻",
    "🇸🇯🤽🏽‍♀️🐴",
    "female",
    "Alice",
    "Carter",
    "Alice_Carter60@yahoo.com",
    "free",
  ],
  [
    "c290840c-a8b0-498e-b782-3ffa6c0e2e50",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1078.jpg",
    "🔁",
    "🚠🖕🏻🛃",
    "male",
    "Louis",
    "Hegmann",
    "Louis.Hegmann@gmail.com",
    "business",
  ],
  [
    "0978d867-e569-4749-b438-ba40b21d6504",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/353.jpg",
    "❎",
    "🐧🎯🇸🇾",
    "female",
    "Yvette",
    "Littel",
    "Yvette_Littel@yahoo.com",
    "business",
  ],
  [
    "f0070bad-5a8e-44e1-96fc-3dd398b0cd67",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/903.jpg",
    "🍸",
    "👩🏽‍🔧🪚👍🏻",
    "female",
    "Arlene",
    "Jacobi",
    "Arlene_Jacobi@yahoo.com",
    "basic",
  ],
  [
    "90c0ef9b-9053-4d3d-a8f6-8cf976f73f31",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/163.jpg",
    "🏖️",
    "🦻🏾🕯️🎚️",
    "female",
    "Pam",
    "Kilback",
    "Pam.Kilback@yahoo.com",
    "basic",
  ],
  [
    "81bc784f-60ba-4404-88c0-f5468546b683",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/656.jpg",
    "🚰",
    "🥊🔮🐶",
    "female",
    "Michele",
    "Maggio",
    "Michele29@hotmail.com",
    "business",
  ],
  [
    "31c9dcd5-f18e-45e5-add4-209a98f82876",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/199.jpg",
    "😮‍💨",
    "😦🐛🐵",
    "female",
    "Kellie",
    "Schmeler",
    "Kellie6@yahoo.com",
    "basic",
  ],
  [
    "34f4b7d0-bb45-4385-990b-dba7e4990075",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/523.jpg",
    "🤌🏻",
    "🦶🙃🤞🏽",
    "male",
    "Dean",
    "West",
    "Dean41@yahoo.com",
    "basic",
  ],
  [
    "5309b757-2cfe-42d4-8c8f-544d1f38bf1e",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1194.jpg",
    "🛣️",
    "📘♦️🥾",
    "female",
    "Tonya",
    "Stiedemann",
    "Tonya.Stiedemann63@gmail.com",
    "basic",
  ],
  [
    "4aef4ed5-a9e3-4c04-9383-b958d3809415",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/25.jpg",
    "🎐",
    "🦶🤳🏿🍺",
    "female",
    "Sonia",
    "Daugherty",
    "Sonia_Daugherty87@yahoo.com",
    "business",
  ],
  [
    "80bf7fc4-4a13-45c0-bf97-157db7de7f8f",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/942.jpg",
    "◀️",
    "🍻🐉🇱🇰",
    "male",
    "Terry",
    "Goldner",
    "Terry_Goldner62@gmail.com",
    "free",
  ],
  [
    "ecc3b0ca-35e3-4c63-92ea-2944b491373a",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1129.jpg",
    "⛑️",
    "🧑🏾‍🏭🐪😎",
    "female",
    "Rosemary",
    "Will",
    "Rosemary67@gmail.com",
    "free",
  ],
  [
    "d89c5ef4-fd14-4544-8055-e6696da1a6f5",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/737.jpg",
    "🎋",
    "💈🏟️👊🏾",
    "female",
    "Jill",
    "Bartell",
    "Jill62@hotmail.com",
    "business",
  ],
  [
    "583c1a5d-27f4-4a02-8ce9-b25a2c4a23fa",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/284.jpg",
    "🔽",
    "🔔🦙🧮",
    "male",
    "Eduardo",
    "Nicolas",
    "Eduardo.Nicolas@gmail.com",
    "basic",
  ],
  [
    "66e9b21d-78ec-473f-8858-fd4462efd8b0",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/100.jpg",
    "🏜️",
    "🇪🇭🎄⬇️",
    "female",
    "Kathy",
    "Toy",
    "Kathy_Toy@yahoo.com",
    "basic",
  ],
  [
    "69a1f9b6-feac-4ade-b267-4225877f81ca",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/884.jpg",
    "👏🏼",
    "🎽💪🏻👨🏿‍🎤",
    "female",
    "Heather",
    "Grady",
    "Heather75@hotmail.com",
    "free",
  ],
  [
    "e75f11e6-b459-48d9-bff6-7c4a02ee4a53",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/813.jpg",
    "⏬",
    "🎅🏼🎭🍵",
    "male",
    "Ted",
    "Balistreri",
    "Ted39@gmail.com",
    "free",
  ],
  [
    "b297a0ca-58a2-478d-9503-eebe42114367",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/165.jpg",
    "⛸️",
    "👃🏽🎓✊",
    "female",
    "Kathleen",
    "Corwin",
    "Kathleen.Corwin@gmail.com",
    "basic",
  ],
  [
    "f141605c-792c-4acd-89bd-6b9cd7d7ed5e",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/7.jpg",
    "🦑",
    "👍🏻🦻🏿🎲",
    "male",
    "Enrique",
    "Lockman",
    "Enrique.Lockman57@hotmail.com",
    "basic",
  ],
  [
    "b6cced0d-91db-4305-8527-6d6e660fefc0",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/885.jpg",
    "🇬🇵",
    "🦻🏻🎍🇧🇿",
    "male",
    "Ronald",
    "Shields",
    "Ronald_Shields24@yahoo.com",
    "basic",
  ],
  [
    "4a223468-de13-47d4-b61b-c20fa2e3e4bb",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1202.jpg",
    "🎿",
    "✏️🇱🇻🧑🏿‍🦱",
    "male",
    "Elmer",
    "Marks",
    "Elmer_Marks54@hotmail.com",
    "basic",
  ],
  [
    "7f9e35e2-44c7-4c23-bf33-9f25c43c03bc",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/80.jpg",
    "©️",
    "🎊🍆🍘",
    "male",
    "Guillermo",
    "Kunde",
    "Guillermo_Kunde@yahoo.com",
    "free",
  ],
  [
    "dec869da-eab6-435c-8496-ff918f0a383a",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/559.jpg",
    "📙",
    "🐏🏉👮🏿‍♀️",
    "female",
    "Myrtle",
    "Kozey",
    "Myrtle.Kozey60@hotmail.com",
    "free",
  ],
  [
    "4dc06513-b375-4b6a-a4d6-c408582ff76d",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/832.jpg",
    "🤞🏾",
    "🥩🌾🖐🏼",
    "female",
    "Brittany",
    "Pfannerstill",
    "Brittany.Pfannerstill91@gmail.com",
    "free",
  ],
  [
    "77f7634e-e925-4d84-af4c-ec21ea277183",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/111.jpg",
    "🤮",
    "🚇🔷⏯️",
    "female",
    "Marilyn",
    "Kunze",
    "Marilyn67@hotmail.com",
    "basic",
  ],
  [
    "7750a57e-41b5-4507-bec7-cfcd606075b0",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/967.jpg",
    "🐻",
    "🔤🇦🇺♑",
    "male",
    "Wallace",
    "Dicki",
    "Wallace99@hotmail.com",
    "free",
  ],
  [
    "d80b3c37-1d19-4b3e-a916-a97375e04d47",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/697.jpg",
    "👆🏾",
    "🇹🇱🍓🇱🇧",
    "male",
    "Charles",
    "Halvorson",
    "Charles.Halvorson27@yahoo.com",
    "business",
  ],
  [
    "cef58fa2-d520-4847-b5ad-4895057b6171",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/723.jpg",
    "🐃",
    "🎗️⚜️🦪",
    "male",
    "Eugene",
    "Ruecker",
    "Eugene.Ruecker@gmail.com",
    "business",
  ],
  [
    "b6fab5d9-0c8b-41ae-92de-ca735193def1",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/51.jpg",
    "🤳🏾",
    "⚽⚓🥥",
    "male",
    "Scott",
    "McDermott",
    "Scott25@yahoo.com",
    "basic",
  ],
  [
    "6fef5aff-e0c8-4e20-9b48-b86aef9228bf",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/748.jpg",
    "▫️",
    "🎟️🥤⚕️",
    "female",
    "Sara",
    "Schmidt",
    "Sara.Schmidt63@yahoo.com",
    "business",
  ],
  [
    "baed9f72-d8d9-4502-b09d-974a244d18da",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1172.jpg",
    "💭",
    "🥤🥔🍣",
    "female",
    "Jessica",
    "Jenkins",
    "Jessica.Jenkins11@gmail.com",
    "basic",
  ],
  [
    "0a1f1a03-271e-4722-a045-16952c73fe23",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/629.jpg",
    "🇩🇰",
    "🖐🏿👘🍀",
    "male",
    "Dan",
    "Marquardt",
    "Dan38@yahoo.com",
    "basic",
  ],
  [
    "3cece571-3f89-4ca0-b20f-140e81df2372",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/884.jpg",
    "🦚",
    "👨🇸🇧💠",
    "male",
    "Laurence",
    "Wilderman",
    "Laurence.Wilderman25@yahoo.com",
    "basic",
  ],
  [
    "1e1139f3-104e-4899-a919-27c48ebadf12",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/950.jpg",
    "🕜",
    "🚵🏽‍♂️🇨🇦🤐",
    "male",
    "Raul",
    "Koepp",
    "Raul12@hotmail.com",
    "free",
  ],
  [
    "40649ba7-62fa-4603-b7e5-19f13b6f94f8",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1199.jpg",
    "👩🏼‍🦲",
    "😙🧒🏻🇹🇴",
    "female",
    "Leslie",
    "Beatty",
    "Leslie34@gmail.com",
    "free",
  ],
  [
    "bc825ac4-4e84-4585-bcb2-22e16c1b6e6d",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/136.jpg",
    "🌧️",
    "👆🏻📬⏭️",
    "male",
    "Rene",
    "Okuneva",
    "Rene_Okuneva42@hotmail.com",
    "basic",
  ],
  [
    "c408fbce-9a74-48e1-b30f-a308e67d752e",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/669.jpg",
    "🐋",
    "👏🏿🎮💮",
    "male",
    "Kerry",
    "Crona",
    "Kerry_Crona50@hotmail.com",
    "free",
  ],
  [
    "a1dcfef0-90f0-4c1b-86ca-0c2bb2807de5",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/740.jpg",
    "🌻",
    "💦📊🔍",
    "female",
    "Patty",
    "Feil",
    "Patty.Feil28@hotmail.com",
    "business",
  ],
  [
    "af40449a-19ec-434c-a5af-a56dc303b0b7",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/206.jpg",
    "🍬",
    "🖖🥌⏰",
    "male",
    "Irvin",
    "Adams",
    "Irvin_Adams29@gmail.com",
    "basic",
  ],
  [
    "3e9a3bb6-808d-42c8-9dd2-2cb0367c32ea",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1026.jpg",
    "♉",
    "🔋🧈🚍",
    "male",
    "Ron",
    "Bechtelar",
    "Ron66@gmail.com",
    "free",
  ],
  [
    "fca7e9f3-197d-417c-a167-f4433939ed30",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/398.jpg",
    "😲",
    "👩🏽‍⚕️☎️🐑",
    "female",
    "Julia",
    "McClure",
    "Julia.McClure31@hotmail.com",
    "basic",
  ],
  [
    "173133f5-8ee9-4393-bb36-1809935e30af",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/72.jpg",
    "🇭🇹",
    "✍🏿👩🏿‍❤️‍💋‍👩🏾🌋",
    "female",
    "Arlene",
    "Reilly",
    "Arlene_Reilly@hotmail.com",
    "business",
  ],
  [
    "9da740fc-3edb-4ae8-967d-39bc40c65ebb",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1172.jpg",
    "🧙",
    "🇨🇭♠️🍼",
    "male",
    "Domingo",
    "Ernser",
    "Domingo24@gmail.com",
    "business",
  ],
  [
    "0844ec64-229d-4a48-a1ff-3ed00dd489d8",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1198.jpg",
    "🍧",
    "🦹🏿‍♂️✡️♀️",
    "female",
    "Bessie",
    "Murphy",
    "Bessie_Murphy@hotmail.com",
    "business",
  ],
  [
    "ef490763-ec6f-4590-877a-7111eb3abd17",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/27.jpg",
    "🟠",
    "🔡🇵🇷🚝",
    "male",
    "David",
    "Hand",
    "David.Hand93@gmail.com",
    "free",
  ],
  [
    "0539d66c-36a0-45b4-86ee-674444e94147",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/380.jpg",
    "🍋",
    "🎀🦻🏿💄",
    "female",
    "Carrie",
    "Cummerata",
    "Carrie_Cummerata@gmail.com",
    "business",
  ],
  [
    "c669fe5d-1940-498c-85a3-da106c01a7b5",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/327.jpg",
    "☣️",
    "🐝🧑🏼‍🔬📼",
    "male",
    "Max",
    "Gislason",
    "Max32@hotmail.com",
    "basic",
  ],
  [
    "9718340f-990a-4961-ac41-7489bef4b375",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/246.jpg",
    "🎇",
    "🎮©️🐩",
    "male",
    "Austin",
    "Pacocha",
    "Austin_Pacocha@hotmail.com",
    "business",
  ],
  [
    "93910026-f2e9-4deb-a953-27ff47a06293",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/759.jpg",
    "🌕",
    "☝🏿🤐👃🏼",
    "male",
    "Dwayne",
    "Gusikowski",
    "Dwayne30@gmail.com",
    "free",
  ],
  [
    "4c9c3f53-4f23-49c6-a29c-a7382b63a5ec",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/71.jpg",
    "😅",
    "🧸🇫🇰👨🏾‍❤️‍👨🏽",
    "male",
    "Javier",
    "Bauch",
    "Javier60@hotmail.com",
    "free",
  ],
  [
    "5413a7dc-4f81-4095-9f75-881ed1909594",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/229.jpg",
    "🇪🇭",
    "✅📎🎴",
    "male",
    "Franklin",
    "Quigley",
    "Franklin75@hotmail.com",
    "basic",
  ],
  [
    "9da15200-1bb7-403b-acdd-ecb6fffe546f",
    "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/516.jpg",
    "🧆",
    "🇸🇩🤿🇨🇾",
    "female",
    "Courtney",
    "Russel",
    "Courtney88@gmail.com",
    "business",
  ],
];
