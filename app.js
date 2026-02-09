const config = {
  refreshMs: 24 * 60 * 60 * 1000,
  goldApiKey: "",
  endpoints: {
    goldApi: "https://api.gold-api.com",
    fx: "https://api.exchangerate.host/latest",
  },
};

const countries = [
  {
    id: "us",
    name: "United States",
    currencyName: "US Dollar",
    currencySymbol: "USD",
    silverGrainsInitial: 371.25,
    silverGrainsFinal: 0,
    debasementEvents: [
      {
        year: 1792,
        law: "Coinage Act of 1792 defines $1 as 371.25 grains of silver (0.77344 troy oz.)",
        grains: 371.25,
      },
      {
        year: 1853,
        law: "Coinage Act of 1853 reduces subsidiary silver coinage",
        grains: 371.25,
      },
      {
        year: 1965,
        law: "Coinage Act of 1965 removes silver from currency",
        grains: 0,
      },
      {
        year: 1971,
        law: "1971: final removal of metal convertibility",
        grains: 0,
      },
    ],
    medianHomePrice: 412000,
    medianAnnualWage: 60000,
  },
  {
    id: "uk",
    name: "United Kingdom",
    currencyName: "British Pound",
    currencySymbol: "GBP",
    silverGrainsInitial: 1718.75,
    silverGrainsFinal: 0,
    debasementEvents: [
      {
        year: 1816,
        law: "Great Recoinage adopts gold standard; silver subsidiary",
        grains: 1718.75,
      },
      {
        year: 1920,
        law: "Silver coin fineness reduced",
        grains: 1375,
      },
      {
        year: 1947,
        law: "Silver removed from circulating coinage",
        grains: 0,
      },
    ],
    medianHomePrice: 285000,
    medianAnnualWage: 34500,
  },
  {
    id: "jp",
    name: "Japan",
    currencyName: "Japanese Yen",
    currencySymbol: "JPY",
    silverGrainsInitial: 416.0,
    silverGrainsFinal: 0,
    debasementEvents: [
      {
        year: 1871,
        law: "New Currency Act defines yen in silver",
        grains: 416.0,
      },
      {
        year: 1931,
        law: "Leaves gold standard",
        grains: 0,
      },
    ],
    medianHomePrice: 32000000,
    medianAnnualWage: 4700000,
  },
];

const elements = {
  currencySelect: document.getElementById("currencySelect"),
  silverPrice: document.getElementById("silverPrice"),
  goldPrice: document.getElementById("goldPrice"),
  debasementPercent: document.getElementById("debasementPercent"),
  debasementDetail: document.getElementById("debasementDetail"),
  eventsTable: document.getElementById("eventsTable")
    ? document.getElementById("eventsTable").querySelector("tbody")
    : null,
  homeOz: document.getElementById("homeOz"),
  wageOz: document.getElementById("wageOz"),
  homeWageRatio: document.getElementById("homeWageRatio"),
  homeOzGold: document.getElementById("homeOzGold"),
  wageOzGold: document.getElementById("wageOzGold"),
  homeWageRatioGold: document.getElementById("homeWageRatioGold"),
  ratioNote: document.getElementById("ratioNote"),
  timelineList: document.getElementById("timelineList"),
  coinGrid: document.getElementById("coinGrid"),
  silverDollarNow: document.getElementById("silverDollarNow"),
  goldDollarNow: document.getElementById("goldDollarNow"),
  chartMoneySupply: document.getElementById("chartMoneySupply"),
  chartAssetWages: document.getElementById("chartAssetWages"),
  chartPurchasingPower: document.getElementById("chartPurchasingPower"),
  chartFedBalance: document.getElementById("chartFedBalance"),
  chartRealRates: document.getElementById("chartRealRates"),
  chartMoneySupplyClone: document.getElementById("chartMoneySupplyClone"),
  chartAssetWagesClone: document.getElementById("chartAssetWagesClone"),
  chartPurchasingPowerClone: document.getElementById("chartPurchasingPowerClone"),
  chartFedBalanceClone: document.getElementById("chartFedBalanceClone"),
  chartRealRatesClone: document.getElementById("chartRealRatesClone"),
  chartModal: document.getElementById("chartModal"),
  chartModalTitle: document.getElementById("chartModalTitle"),
  chartModalSub: document.getElementById("chartModalSub"),
  chartModalCanvas: document.getElementById("chartModalCanvas"),
  chartModalSource: document.getElementById("chartModalSource"),
};

const constitutionalSilver = {
  silverDollarOz: 0.7734,
  silverPrice1965UsdOz: 1.29,
  faceValueUsd: 1,
  goldDollarOz1934: 0.0285625,
};

const COINAGE_1792 = {
  silverDollarOz: 0.77344,
  goldDollarOz: 0.05156,
};

const coinFilters = {
  silver: "All",
  gold: "All",
};

let lastMarketData = null;

const COIN_CATALOG = [
  {
    id: "gold-liberty-1-type1",
    name: "Liberty Head Gold Dollar (Type 1)",
    years: "1849-1854",
    faceValue: "$1",
    metal: "gold",
    category: "$1",
    contentOz: 0.04837,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/liberty head type 1.jpg",
  },
  {
    id: "gold-indian-1-type2",
    name: "Indian Head Gold Dollar (Type 2)",
    years: "1854-1856",
    faceValue: "$1",
    metal: "gold",
    category: "$1",
    contentOz: 0.04837,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/liberty head dollar type 2.jpg",
  },
  {
    id: "gold-indian-1-type3",
    name: "Indian Head Gold Dollar (Type 3)",
    years: "1856-1889",
    faceValue: "$1",
    metal: "gold",
    category: "$1",
    contentOz: 0.04837,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/liberty head gold dollar type 3.jpg",
  },
  {
    id: "gold-liberty-250",
    name: "Liberty Head $2.50",
    years: "1840-1907",
    faceValue: "$2.50",
    metal: "gold",
    category: "$2.50",
    contentOz: 0.12094,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/liberty head 2.50.jpeg",
  },
  {
    id: "gold-indian-250",
    name: "Indian Head $2.50",
    years: "1908-1929",
    faceValue: "$2.50",
    metal: "gold",
    category: "$2.50",
    contentOz: 0.12094,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/indian head 2.50.jpeg",
  },
  {
    id: "gold-indian-3",
    name: "Indian Head $3",
    years: "1854-1889",
    faceValue: "$3",
    metal: "gold",
    category: "$3",
    contentOz: 0.14512,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/indian head 3 dollar.jpg",
  },
  {
    id: "gold-liberty-5",
    name: "Liberty Head $5",
    years: "1839-1908",
    faceValue: "$5",
    metal: "gold",
    category: "$5",
    contentOz: 0.24187,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/liberty head 5.jpeg",
  },
  {
    id: "gold-indian-5",
    name: "Indian Head $5",
    years: "1908-1929",
    faceValue: "$5",
    metal: "gold",
    category: "$5",
    contentOz: 0.24187,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/indian head 5.jpg",
  },
  {
    id: "gold-liberty-10",
    name: "Liberty Head $10",
    years: "1838-1907",
    faceValue: "$10",
    metal: "gold",
    category: "$10",
    contentOz: 0.48375,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/liberty head 10.jpg",
  },
  {
    id: "gold-indian-10",
    name: "Indian Head $10",
    years: "1907-1933",
    faceValue: "$10",
    metal: "gold",
    category: "$10",
    contentOz: 0.48375,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/indian head 10.jpeg",
  },
  {
    id: "gold-liberty-20",
    name: "Liberty Head $20",
    years: "1849-1907",
    faceValue: "$20",
    metal: "gold",
    category: "$20",
    contentOz: 0.9675,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/liberty head 20.jpeg",
  },
  {
    id: "gold-saint-gaudens-20",
    name: "Saint-Gaudens $20",
    years: "1907-1933",
    faceValue: "$20",
    metal: "gold",
    category: "$20",
    contentOz: 0.9675,
    contentLabel: "AGW",
    image: "photos/us_coin_obverses_clean/gold/st-gaudens double eagle.jpeg",
  },
  {
    id: "silver-jefferson-wartime",
    name: "Jefferson Nickel",
    years: "1942-1945",
    faceValue: "$0.05",
    metal: "silver",
    category: "Nickel",
    contentOz: 0.0563,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/jerfferson_nickel.jpg",
  },
  {
    id: "silver-barber-dime",
    name: "Barber Dime",
    years: "1892-1916",
    faceValue: "$0.10",
    metal: "silver",
    category: "Dime",
    contentOz: 0.0723,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/barber dime.avif",
  },
  {
    id: "silver-mercury-dime",
    name: "Mercury Dime",
    years: "1916-1945",
    faceValue: "$0.10",
    metal: "silver",
    category: "Dime",
    contentOz: 0.0723,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/mercury dime.jpg",
  },
  {
    id: "silver-roosevelt-dime",
    name: "Roosevelt Dime",
    years: "1946-1964",
    faceValue: "$0.10",
    metal: "silver",
    category: "Dime",
    contentOz: 0.0723,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/roosevelt dime.jpg",
  },
  {
    id: "silver-barber-quarter",
    name: "Barber Quarter",
    years: "1892-1916",
    faceValue: "$0.25",
    metal: "silver",
    category: "Quarter",
    contentOz: 0.1808,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/barberquarter.jpg",
  },
  {
    id: "silver-standing-liberty-quarter",
    name: "Standing Liberty Quarter",
    years: "1916-1930",
    faceValue: "$0.25",
    metal: "silver",
    category: "Quarter",
    contentOz: 0.1808,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/standing liberty quarter.jpeg",
  },
  {
    id: "silver-washington-quarter",
    name: "Washington Quarter",
    years: "1932-1964",
    faceValue: "$0.25",
    metal: "silver",
    category: "Quarter",
    contentOz: 0.1808,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/washington quarter.jpg",
  },
  {
    id: "silver-barber-half",
    name: "Barber Half Dollar",
    years: "1892-1915",
    faceValue: "$0.50",
    metal: "silver",
    category: "Half Dollar",
    contentOz: 0.36169,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/barber half dollar.jpeg",
  },
  {
    id: "silver-walking-liberty-half",
    name: "Walking Liberty Half Dollar",
    years: "1916-1947",
    faceValue: "$0.50",
    metal: "silver",
    category: "Half Dollar",
    contentOz: 0.36169,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/walking liberty half dollars.jpg",
  },
  {
    id: "silver-franklin-half",
    name: "Franklin Half Dollar",
    years: "1948-1963",
    faceValue: "$0.50",
    metal: "silver",
    category: "Half Dollar",
    contentOz: 0.36169,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/franklin half dollars.jpg",
  },
  {
    id: "silver-kennedy-half-1964",
    name: "Kennedy Half Dollar (90% Silver)",
    years: "1964",
    faceValue: "$0.50",
    metal: "silver",
    category: "Half Dollar",
    contentOz: 0.36169,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/90% Kennedy Half Dollars.jpg",
  },
  {
    id: "silver-kennedy-half-40",
    name: "Kennedy Half Dollar (40% Silver)",
    years: "1965-1970",
    faceValue: "$0.50",
    metal: "silver",
    category: "Half Dollar",
    contentOz: 0.1479,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/40% Kennedy Half Dollar.jpg",
  },
  {
    id: "silver-morgan-dollar",
    name: "Morgan Dollar",
    years: "1878-1921",
    faceValue: "$1",
    metal: "silver",
    category: "Dollar",
    contentOz: 0.7734,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/morgan dollar.jpg",
  },
  {
    id: "silver-peace-dollar",
    name: "Peace Dollar",
    years: "1921-1935",
    faceValue: "$1",
    metal: "silver",
    category: "Dollar",
    contentOz: 0.7734,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/peace dollar.jpg",
  },
  {
    id: "silver-eisenhower-silver",
    name: "Eisenhower Dollar",
    years: "1971-1976",
    faceValue: "$1",
    metal: "silver",
    category: "Dollar",
    contentOz: 0.3161,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/eisenhower dollar.jpeg",
  },
  {
    id: "silver-ase",
    name: "American Silver Eagle",
    years: "1986-Date",
    faceValue: "$1",
    metal: "silver",
    category: "Dollar",
    contentOz: 1.0,
    contentLabel: "ASW",
    image: "photos/us_coin_obverses_clean/silver/american silver eagle.jpg",
  },
];

function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return `${formatNumber(value, 0)}%`;
}

async function fetchGoldApiPrice(symbol) {
  const url = `${config.endpoints.goldApi}/price/${encodeURIComponent(symbol)}`;
  const headers = {};
  if (config.goldApiKey) {
    headers["x-api-key"] = config.goldApiKey;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Gold API request failed: ${response.status}`);
  }
  const data = await response.json();
  if (!data || typeof data.price !== "number") {
    throw new Error("Gold API price missing");
  }
  return Number(data.price);
}

async function fetchFxRate(localCurrency) {
  if (localCurrency === "USD") {
    return 1;
  }
  const url = `${config.endpoints.fx}?base=USD&symbols=${encodeURIComponent(
    localCurrency
  )}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FX request failed: ${response.status}`);
  }
  const data = await response.json();
  const rate = data && data.rates ? data.rates[localCurrency] : null;
  if (!rate) {
    throw new Error("FX rate missing");
  }
  return Number(rate);
}

async function fetchMarketData(country) {
  try {
    const [silverPrice, goldPrice] = await Promise.all([
      fetchGoldApiPrice("XAG"),
      fetchGoldApiPrice("XAU"),
    ]);
    let fxRate = 1;
    try {
      fxRate = await fetchFxRate(country.currencySymbol);
    } catch (error) {
      fxRate = 1;
    }
    return { silverPrice, goldPrice, fxRate };
  } catch (error) {
    return { silverPrice: null, goldPrice: null, fxRate: 1 };
  }
}

function populateCurrencies() {
  if (!elements.currencySelect) {
    return;
  }
  elements.currencySelect.innerHTML = "";
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.id;
    option.textContent = `${country.currencyName} (${country.currencySymbol})`;
    elements.currencySelect.appendChild(option);
  });
}

function calculateDebasement(country) {
  const initial = country.silverGrainsInitial;
  const final = country.silverGrainsFinal;
  if (!initial || initial === 0) {
    return { percent: null, detail: "Missing initial silver content" };
  }
  const percent = ((initial - final) / initial) * 100;
  return {
    percent,
    detail: `From ${initial} grains to ${final} grains per ${country.currencySymbol}`,
  };
}

function calculateConstitutionalDebasement(silverPriceUsd) {
  if (!silverPriceUsd) {
    return { percent: null, detail: "Silver price unavailable" };
  }
  const silverDollarNow = silverPriceUsd * constitutionalSilver.silverDollarOz;
  const silverDollar1965 =
    constitutionalSilver.silverPrice1965UsdOz *
    constitutionalSilver.silverDollarOz;
  const percent = ((silverDollarNow / silverDollar1965) - 1) * 100;
  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return {
    percent,
    detail: `1964 Silver Dollar: $1.00 → $${formatNumber(
      silverDollarNow,
      2
    )} on ${todayLabel}`,
  };
}

function calculateGoldInflation(goldPriceUsd) {
  if (!goldPriceUsd) {
    return { percent: null, detail: "Gold price unavailable" };
  }
  const goldDollarNow = goldPriceUsd * constitutionalSilver.goldDollarOz1934;
  const percent = (goldDollarNow - 1) * 100;
  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return {
    percent,
    detail: `1933 Gold Dollar: $1.00 → $${formatNumber(
      goldDollarNow,
      2
    )} on ${todayLabel}`,
  };
}

function renderEvents(country) {
  if (!elements.eventsTable) {
    return;
  }
  elements.eventsTable.innerHTML = "";
  country.debasementEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${event.year}</td>
      <td>${event.law}</td>
      <td>${formatNumber(event.grains, 2)}</td>
    `;
    elements.eventsTable.appendChild(row);
  });
}

function renderTimeline(country) {
  if (!elements.timelineList) {
    return;
  }

  const container = elements.timelineList;
  container.innerHTML = "";

  const events = [...country.debasementEvents].sort((a, b) => a.year - b.year);
  events.forEach((event, index) => {
    const item = document.createElement("div");
    item.className = `timeline-item ${index % 2 === 0 ? "left" : "right"}`;

    const card = document.createElement("div");
    card.className = "timeline-card";

    const year = document.createElement("div");
    year.className = "timeline-year";
    year.textContent = event.year;

    const law = document.createElement("div");
    law.className = "timeline-law";
    law.textContent = event.law;

    const grains = document.createElement("div");
    grains.className = "timeline-grains";
    grains.textContent = `${formatNumber(event.grains, 2)} grains per $1`;

    card.appendChild(year);
    card.appendChild(law);
    card.appendChild(grains);
    item.appendChild(card);
    container.appendChild(item);
  });
}

function renderCoinGrid(coins, marketData) {
  if (!elements.coinGrid) {
    return;
  }

  elements.coinGrid.innerHTML = "";

  const groups = [
    { id: "coin-silver", label: "Silver", metal: "silver" },
    { id: "coin-gold", label: "Gold", metal: "gold" },
  ];
  const filterOptions = {
    silver: ["All", "Nickel", "Dime", "Quarter", "Half Dollar", "Dollar"],
    gold: ["All", "$1", "$2.50", "$3", "$5", "$10", "$20"],
  };

  groups.forEach((group) => {
    const section = document.createElement("div");
    section.className = "coin-section";
    section.id = group.id;

    const title = document.createElement("div");
    title.className = "coin-section-title";
    title.textContent = group.label;
    section.appendChild(title);

    const filterBar = document.createElement("div");
    filterBar.className = "coin-filter";
    filterOptions[group.metal].forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "coin-filter-btn";
      if (coinFilters[group.metal] === option) {
        button.classList.add("active");
      }
      button.textContent = option;
      button.addEventListener("click", () => {
        coinFilters[group.metal] = option;
        if (lastMarketData) {
          renderCoinGrid(coins, lastMarketData);
        }
      });
      filterBar.appendChild(button);
    });
    section.appendChild(filterBar);

    const grid = document.createElement("div");
    grid.className = "coin-section-grid";

    coins
      .filter((coin) => {
        if (coin.metal !== group.metal) {
          return false;
        }
        if (coinFilters[group.metal] === "All") {
          return true;
        }
        return coin.category === coinFilters[group.metal];
      })
      .forEach((coin) => {
        const spotPrice =
          coin.metal === "gold" ? marketData.goldPrice : marketData.silverPrice;
        const meltValue = spotPrice ? spotPrice * coin.contentOz : null;
        const card = document.createElement("div");
        card.className = "coin-card";
        card.innerHTML = `
          <img class="coin-image" src="${coin.image}" alt="${coin.name} obverse" />
          <div class="coin-body">
            <div class="coin-tag">${coin.metal}</div>
            <div class="coin-title">${coin.name}</div>
            <div class="coin-meta">Minted from: ${coin.years}</div>
            <div class="coin-content">
              ${coin.metal === "gold" ? "AGW" : "ASW"}:
              ${formatNumber(coin.contentOz, 5)} oz
            </div>
            <div class="coin-melt">${
              meltValue ? `$${formatNumber(meltValue, 2)}` : "-"
            }</div>
          </div>
        `;
        grid.appendChild(card);
      });

    section.appendChild(grid);
    elements.coinGrid.appendChild(section);
  });
}

function calculateRatios(country, silverPriceUsd, goldPriceUsd, fxRate) {
  if (
    !silverPriceUsd ||
    !goldPriceUsd ||
    !country.medianHomePrice ||
    !country.medianAnnualWage
  ) {
    return {
      homeOz: null,
      wageOz: null,
      ratio: null,
      homeOzGold: null,
      wageOzGold: null,
      ratioGold: null,
    };
  }

  const silverPriceLocal = silverPriceUsd * fxRate;
  const goldPriceLocal = goldPriceUsd * fxRate;

  const homeOz = country.medianHomePrice / silverPriceLocal;
  const wageOz = country.medianAnnualWage / silverPriceLocal;
  const ratio = homeOz / wageOz;

  const homeOzGold = country.medianHomePrice / goldPriceLocal;
  const wageOzGold = country.medianAnnualWage / goldPriceLocal;
  const ratioGold = homeOzGold / wageOzGold;

  return { homeOz, wageOz, ratio, homeOzGold, wageOzGold, ratioGold };
}

function parseHomePriceCsv(text) {
  const lines = text.trim().split("\n");
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const parts = lines[i].split("\t");
    if (parts.length < 2) {
      continue;
    }
    const date = new Date(parts[0]);
    const value = Number(parts[1]);
    if (Number.isNaN(date.getTime()) || Number.isNaN(value)) {
      continue;
    }
    rows.push({ date, value });
  }
  return rows;
}

function renderLineChart(svg, rows, options = {}) {
  if (!svg || rows.length === 0) {
    return;
  }
  svg.innerHTML = "";

  const width = 800;
  const height = 240;
  const padding = { left: 50, right: 20, top: 20, bottom: 30 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const minDate = rows[0].date.getTime();
  const maxDate = rows[rows.length - 1].date.getTime();
  const values = rows.map((row) => row.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const scaleX = (date) =>
    padding.left +
    ((date.getTime() - minDate) / (maxDate - minDate || 1)) * plotWidth;
  const scaleY = (value) =>
    padding.top + (1 - (value - minValue) / (maxValue - minValue || 1)) * plotHeight;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const axis = document.createElementNS("http://www.w3.org/2000/svg", "path");
  axis.setAttribute(
    "d",
    `M ${padding.left} ${padding.top} V ${height - padding.bottom} H ${
      width - padding.right
    }`
  );
  axis.setAttribute("stroke", "#cbd5e1");
  axis.setAttribute("fill", "none");
  axis.setAttribute("stroke-width", "1");
  svg.appendChild(axis);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const path = rows
    .map((row, index) => {
      const x = scaleX(row.date);
      const y = scaleY(row.value);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  line.setAttribute("d", path);
  line.setAttribute("stroke", options.stroke || "#1d3f8b");
  line.setAttribute("fill", "none");
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);

  const startLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  startLabel.setAttribute("x", padding.left);
  startLabel.setAttribute("y", height - 8);
  startLabel.setAttribute("font-size", "12");
  startLabel.setAttribute("fill", "#1f2a44");
  startLabel.setAttribute("font-weight", "700");
  startLabel.setAttribute("letter-spacing", "0.6");
  startLabel.textContent = rows[0].date.getFullYear();
  svg.appendChild(startLabel);

  const endLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  endLabel.setAttribute("x", width - padding.right);
  endLabel.setAttribute("y", height - 8);
  endLabel.setAttribute("text-anchor", "end");
  endLabel.setAttribute("font-size", "12");
  endLabel.setAttribute("fill", "#1f2a44");
  endLabel.setAttribute("font-weight", "700");
  endLabel.setAttribute("letter-spacing", "0.6");
  endLabel.textContent = rows[rows.length - 1].date.getFullYear();
  svg.appendChild(endLabel);

  const topLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  topLabel.setAttribute("x", padding.left);
  topLabel.setAttribute("y", padding.top - 6);
  topLabel.setAttribute("font-size", "12");
  topLabel.setAttribute("fill", "#1f2a44");
  topLabel.setAttribute("font-weight", "700");
  topLabel.setAttribute("letter-spacing", "0.6");
  topLabel.textContent = `$${formatNumber(maxValue, 0)}`;
  svg.appendChild(topLabel);
}

const FRED_BASE_URL = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=";
const FRED_PROXY_URL = "http://localhost:4180/fred?series=";
const FRED_SERIES = {
  m2: "M2SL",
  cpi: "CPIAUCSL",
  income: "MEHOINUSA646N",
  home: "MSPUS",
  sp500: "SP500",
  tuition: "CUUR0000SEEB01",
  fedBalance: "WALCL",
  fedFunds: "FEDFUNDS",
};
const FRED_CACHE = {};
const CHART_COLORS = {
  m2: "#1d3f8b",
  purchasingPower: "#b22234",
  wages: "#b22234",
  home: "#1d3f8b",
  sp500: "#1d3f8b",
  tuition: "#b22234",
  fedBalance: "#b22234",
  realRate: "#b22234",
};

function parseFredCsv(text) {
  const lines = text.trim().split("\n");
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const parts = lines[i].split(",");
    if (parts.length < 2) {
      continue;
    }
    const date = new Date(parts[0]);
    const value = Number(parts[1]);
    if (!parts[1] || parts[1] === "." || Number.isNaN(value)) {
      continue;
    }
    if (Number.isNaN(date.getTime())) {
      continue;
    }
    rows.push({ date, value });
  }
  return rows;
}

function setChartStatus(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
  }
}

async function fetchFredSeries(seriesId) {
  if (FRED_CACHE[seriesId]) {
    return FRED_CACHE[seriesId];
  }
  const url = `${FRED_PROXY_URL}${seriesId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FRED request failed: ${response.status}`);
  }
  const text = await response.text();
  const rows = parseFredCsv(text);
  FRED_CACHE[seriesId] = rows;
  return rows;
}

function filterFromYear(rows, startYear) {
  return rows.filter((row) => row.date.getFullYear() >= startYear);
}

function findBaseRow(rows, baseYear) {
  const inYear = rows.find((row) => row.date.getFullYear() === baseYear);
  if (inYear) {
    return inYear;
  }
  return rows.find((row) => row.date.getFullYear() > baseYear) || null;
}

function indexSeries(rows, baseYear) {
  const baseRow = findBaseRow(rows, baseYear);
  if (!baseRow) {
    return { rows: [], baseYearUsed: null };
  }
  const baseValue = baseRow.value || 1;
  return {
    rows: rows.map((row) => ({
      date: row.date,
      value: (row.value / baseValue) * 100,
    })),
    baseYearUsed: baseRow.date.getFullYear(),
  };
}

function percentChangeSeries(rows, baseYear, inverse = false) {
  const baseRow = findBaseRow(rows, baseYear);
  if (!baseRow) {
    return { rows: [], baseYearUsed: null };
  }
  const baseValue = baseRow.value || 1;
  return {
    rows: rows.map((row) => ({
      date: row.date,
      value: inverse
        ? ((baseValue / row.value) - 1) * 100
        : ((row.value / baseValue) - 1) * 100,
    })),
    baseYearUsed: baseRow.date.getFullYear(),
  };
}

function computePurchasingPower(cpiRows, baseYear) {
  const baseRow = findBaseRow(cpiRows, baseYear);
  if (!baseRow) {
    return { rows: [], baseYearUsed: null };
  }
  const baseValue = baseRow.value || 1;
  return {
    rows: cpiRows.map((row) => ({
      date: row.date,
      value: (baseValue / row.value) * 100,
    })),
    baseYearUsed: baseRow.date.getFullYear(),
  };
}

function computeYoYInflation(cpiRows) {
  const byMonth = new Map();
  cpiRows.forEach((row) => {
    const key = `${row.date.getFullYear()}-${row.date.getMonth()}`;
    byMonth.set(key, row.value);
  });
  const rows = [];
  cpiRows.forEach((row) => {
    const prevYear = row.date.getFullYear() - 1;
    const key = `${prevYear}-${row.date.getMonth()}`;
    const prevValue = byMonth.get(key);
    if (!prevValue) {
      return;
    }
    const inflation = ((row.value / prevValue) - 1) * 100;
    rows.push({ date: row.date, value: inflation });
  });
  return rows;
}

function renderEmptyChart(svg, message) {
  if (!svg) {
    return;
  }
  svg.innerHTML = "";
  const width = 800;
  const height = 240;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", width / 2);
  label.setAttribute("y", height / 2);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("font-size", "12");
  label.setAttribute("fill", "#94a3b8");
  label.textContent = message;
  svg.appendChild(label);
}

function buildLinePath(rows, scaleX, scaleY, step) {
  if (!rows.length) {
    return "";
  }
  if (!step) {
    return rows
      .map((row, index) => {
        const x = scaleX(row.date);
        const y = scaleY(row.value);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }
  let path = "";
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const x = scaleX(row.date);
    const y = scaleY(row.value);
    if (i === 0) {
      path += `M ${x} ${y}`;
      continue;
    }
    path += ` H ${x} V ${y}`;
  }
  return path;
}

function renderMultiLineChart(svg, seriesList, options = {}) {
  if (!svg) {
    return;
  }
  const series = seriesList.filter((item) => item.rows && item.rows.length);
  if (!series.length) {
    renderEmptyChart(svg, "No data");
    return;
  }
  svg.innerHTML = "";
  const width = 800;
  const height = 240;
  const padding = { left: 50, right: 20, top: 20, bottom: 30 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const allRows = series.flatMap((item) => item.rows);
  const minDate = Math.min(...allRows.map((row) => row.date.getTime()));
  const maxDate = Math.max(...allRows.map((row) => row.date.getTime()));
  let values = allRows.map((row) => row.value);
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (options.includeZero) {
    minValue = Math.min(minValue, 0);
    maxValue = Math.max(maxValue, 0);
  }
  if (typeof options.minValue === "number") {
    minValue = options.minValue;
  }
  if (typeof options.maxValue === "number") {
    maxValue = options.maxValue;
  }

  const scaleX = (date) =>
    padding.left +
    ((date.getTime() - minDate) / (maxDate - minDate || 1)) * plotWidth;
  const scaleY = (value) =>
    padding.top + (1 - (value - minValue) / (maxValue - minValue || 1)) * plotHeight;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const axis = document.createElementNS("http://www.w3.org/2000/svg", "path");
  axis.setAttribute(
    "d",
    `M ${padding.left} ${padding.top} V ${height - padding.bottom} H ${
      width - padding.right
    }`
  );
  axis.setAttribute("stroke", "#cbd5e1");
  axis.setAttribute("fill", "none");
  axis.setAttribute("stroke-width", "1");
  svg.appendChild(axis);

  if (options.rightAxis) {
    const axisRight = document.createElementNS("http://www.w3.org/2000/svg", "path");
    axisRight.setAttribute(
      "d",
      `M ${width - padding.right} ${padding.top} V ${height - padding.bottom}`
    );
    axisRight.setAttribute("stroke", "#cbd5e1");
    axisRight.setAttribute("fill", "none");
    axisRight.setAttribute("stroke-width", "1");
    svg.appendChild(axisRight);
  }

  if (options.zeroLine) {
    const zero = document.createElementNS("http://www.w3.org/2000/svg", "line");
    zero.setAttribute("x1", padding.left);
    zero.setAttribute("x2", width - padding.right);
    zero.setAttribute("y1", scaleY(0));
    zero.setAttribute("y2", scaleY(0));
    zero.setAttribute("stroke", "#94a3b8");
    zero.setAttribute("stroke-dasharray", "4 4");
    zero.setAttribute("stroke-width", "1");
    svg.appendChild(zero);
  }

  if (options.eventMarkers && options.eventMarkers.length) {
    options.eventMarkers.forEach((marker) => {
      const x = scaleX(new Date(marker.year, 0, 1));
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x);
      line.setAttribute("x2", x);
      line.setAttribute("y1", padding.top);
      line.setAttribute("y2", height - padding.bottom);
      line.setAttribute("stroke", "#e2e8f0");
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x + 4);
      label.setAttribute("y", padding.top + 12);
      label.setAttribute("font-size", "9");
      label.setAttribute("fill", "#94a3b8");
      label.textContent = marker.label || marker.year;
      svg.appendChild(label);
    });
  }

  series.forEach((item) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const path = buildLinePath(item.rows, scaleX, scaleY, item.step);
    line.setAttribute("d", path);
    line.setAttribute("stroke", item.color || "#1d3f8b");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-width", item.strokeWidth || "2");
    svg.appendChild(line);
  });

  const startLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  startLabel.setAttribute("x", padding.left);
  startLabel.setAttribute("y", height - 8);
  startLabel.setAttribute("font-size", "12");
  startLabel.setAttribute("fill", "#1f2a44");
  startLabel.setAttribute("font-weight", "700");
  startLabel.setAttribute("letter-spacing", "0.6");
  startLabel.textContent = new Date(minDate).getFullYear();
  svg.appendChild(startLabel);

  const endLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  endLabel.setAttribute("x", width - padding.right);
  endLabel.setAttribute("y", height - 8);
  endLabel.setAttribute("text-anchor", "end");
  endLabel.setAttribute("font-size", "12");
  endLabel.setAttribute("fill", "#1f2a44");
  endLabel.setAttribute("font-weight", "700");
  endLabel.setAttribute("letter-spacing", "0.6");
  endLabel.textContent = new Date(maxDate).getFullYear();
  svg.appendChild(endLabel);

  const labelFormatter =
    options.labelFormatter || ((value) => formatNumber(value, 0));

  const topLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  topLabel.setAttribute("x", padding.left);
  topLabel.setAttribute("y", padding.top - 6);
  topLabel.setAttribute("font-size", "12");
  topLabel.setAttribute("fill", "#1f2a44");
  topLabel.setAttribute("font-weight", "700");
  topLabel.setAttribute("letter-spacing", "0.6");
  topLabel.textContent = labelFormatter(maxValue);
  svg.appendChild(topLabel);

  if (options.rightLabel) {
    const rightLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rightLabel.setAttribute("x", width - padding.right);
    rightLabel.setAttribute("y", padding.top - 6);
    rightLabel.setAttribute("text-anchor", "end");
    rightLabel.setAttribute("font-size", "12");
    rightLabel.setAttribute("fill", "#1f2a44");
    rightLabel.setAttribute("font-weight", "700");
    rightLabel.setAttribute("letter-spacing", "0.6");
    rightLabel.textContent = options.rightLabel;
    svg.appendChild(rightLabel);
  }
}

function renderDualAxisChart(svg, leftSeries, rightSeries, options = {}) {
  if (!svg || !leftSeries.rows.length || !rightSeries.rows.length) {
    renderEmptyChart(svg, "No data");
    return;
  }
  svg.innerHTML = "";
  const width = 800;
  const height = 240;
  const padding = { left: 56, right: 56, top: 26, bottom: 30 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const allRows = [...leftSeries.rows, ...rightSeries.rows];
  const minDate = Math.min(...allRows.map((row) => row.date.getTime()));
  const maxDate = Math.max(...allRows.map((row) => row.date.getTime()));

  const leftValues = leftSeries.rows.map((row) => row.value);
  const rightValues = rightSeries.rows.map((row) => row.value);
  const minLeft = Math.min(...leftValues);
  const maxLeft = Math.max(...leftValues);
  const minRight = Math.min(...rightValues);
  const maxRight = Math.max(...rightValues);

  const scaleX = (date) =>
    padding.left +
    ((date.getTime() - minDate) / (maxDate - minDate || 1)) * plotWidth;
  const scaleYLeft = (value) =>
    padding.top + (1 - (value - minLeft) / (maxLeft - minLeft || 1)) * plotHeight;
  const scaleYRight = (value) =>
    padding.top + (1 - (value - minRight) / (maxRight - minRight || 1)) * plotHeight;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const axis = document.createElementNS("http://www.w3.org/2000/svg", "path");
  axis.setAttribute(
    "d",
    `M ${padding.left} ${padding.top} V ${height - padding.bottom} H ${
      width - padding.right
    }`
  );
  axis.setAttribute("stroke", "#cbd5e1");
  axis.setAttribute("fill", "none");
  axis.setAttribute("stroke-width", "1");
  svg.appendChild(axis);

  const axisRight = document.createElementNS("http://www.w3.org/2000/svg", "path");
  axisRight.setAttribute(
    "d",
    `M ${width - padding.right} ${padding.top} V ${height - padding.bottom}`
  );
  axisRight.setAttribute("stroke", "#cbd5e1");
  axisRight.setAttribute("fill", "none");
  axisRight.setAttribute("stroke-width", "1");
  svg.appendChild(axisRight);

  const leftLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
  leftLine.setAttribute(
    "d",
    buildLinePath(leftSeries.rows, scaleX, scaleYLeft, leftSeries.step)
  );
  leftLine.setAttribute("stroke", leftSeries.color || "#1d3f8b");
  leftLine.setAttribute("fill", "none");
  leftLine.setAttribute("stroke-width", leftSeries.strokeWidth || "2");
  svg.appendChild(leftLine);

  const rightLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
  rightLine.setAttribute(
    "d",
    buildLinePath(rightSeries.rows, scaleX, scaleYRight, rightSeries.step)
  );
  rightLine.setAttribute("stroke", rightSeries.color || "#b22234");
  rightLine.setAttribute("fill", "none");
  rightLine.setAttribute("stroke-width", rightSeries.strokeWidth || "2");
  svg.appendChild(rightLine);

  const startLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  startLabel.setAttribute("x", padding.left);
  startLabel.setAttribute("y", height - 8);
  startLabel.setAttribute("font-size", "12");
  startLabel.setAttribute("fill", "#1f2a44");
  startLabel.setAttribute("font-weight", "700");
  startLabel.setAttribute("letter-spacing", "0.6");
  startLabel.textContent = new Date(minDate).getFullYear();
  svg.appendChild(startLabel);

  const endLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  endLabel.setAttribute("x", width - padding.right);
  endLabel.setAttribute("y", height - 8);
  endLabel.setAttribute("text-anchor", "end");
  endLabel.setAttribute("font-size", "12");
  endLabel.setAttribute("fill", "#1f2a44");
  endLabel.setAttribute("font-weight", "700");
  endLabel.setAttribute("letter-spacing", "0.6");
  endLabel.textContent = new Date(maxDate).getFullYear();
  svg.appendChild(endLabel);

  const labelFormatter =
    options.labelFormatter || ((value) => `${formatNumber(value, 0)}%`);

  const leftAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  leftAxisLabel.setAttribute("x", padding.left);
  leftAxisLabel.setAttribute("y", padding.top - 18);
  leftAxisLabel.setAttribute("font-size", "11");
  leftAxisLabel.setAttribute("fill", leftSeries.color || "#1d3f8b");
  leftAxisLabel.setAttribute("font-weight", "700");
  leftAxisLabel.setAttribute("letter-spacing", "0.6");
  leftAxisLabel.textContent = options.leftAxisLabel || "";
  svg.appendChild(leftAxisLabel);

  const rightAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  rightAxisLabel.setAttribute("x", width - padding.right);
  rightAxisLabel.setAttribute("y", padding.top - 18);
  rightAxisLabel.setAttribute("text-anchor", "end");
  rightAxisLabel.setAttribute("font-size", "11");
  rightAxisLabel.setAttribute("fill", rightSeries.color || "#b22234");
  rightAxisLabel.setAttribute("font-weight", "700");
  rightAxisLabel.setAttribute("letter-spacing", "0.6");
  rightAxisLabel.textContent = options.rightAxisLabel || "";
  svg.appendChild(rightAxisLabel);

  const leftTopLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  leftTopLabel.setAttribute("x", padding.left);
  leftTopLabel.setAttribute("y", padding.top - 4);
  leftTopLabel.setAttribute("font-size", "12");
  leftTopLabel.setAttribute("fill", leftSeries.color || "#1d3f8b");
  leftTopLabel.setAttribute("font-weight", "700");
  leftTopLabel.setAttribute("letter-spacing", "0.6");
  leftTopLabel.textContent = labelFormatter(maxLeft);
  svg.appendChild(leftTopLabel);

  const rightTopLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  rightTopLabel.setAttribute("x", width - padding.right);
  rightTopLabel.setAttribute("y", padding.top - 4);
  rightTopLabel.setAttribute("text-anchor", "end");
  rightTopLabel.setAttribute("font-size", "12");
  rightTopLabel.setAttribute("fill", rightSeries.color || "#b22234");
  rightTopLabel.setAttribute("font-weight", "700");
  rightTopLabel.setAttribute("letter-spacing", "0.6");
  rightTopLabel.textContent = labelFormatter(maxRight);
  svg.appendChild(rightTopLabel);
}

function renderChartPair(primarySvg, cloneSvg, seriesList, options = {}) {
  renderMultiLineChart(primarySvg, seriesList, options);
  renderMultiLineChart(cloneSvg, seriesList, options);
}

const HOME_PRICE_CSV = `date\tmedian_sales_price_usd\tseries_id\tfrequency\tunits
1963-01-01\t17800\tMSPUS\tQuarterly\tDollars
1963-04-01\t18000\tMSPUS\tQuarterly\tDollars
1963-07-01\t17900\tMSPUS\tQuarterly\tDollars
1963-10-01\t18500\tMSPUS\tQuarterly\tDollars
1964-01-01\t18500\tMSPUS\tQuarterly\tDollars
1964-04-01\t18900\tMSPUS\tQuarterly\tDollars
1964-07-01\t18900\tMSPUS\tQuarterly\tDollars
1964-10-01\t19400\tMSPUS\tQuarterly\tDollars
1965-01-01\t20200\tMSPUS\tQuarterly\tDollars
1965-04-01\t19800\tMSPUS\tQuarterly\tDollars
1965-07-01\t20200\tMSPUS\tQuarterly\tDollars
1965-10-01\t20300\tMSPUS\tQuarterly\tDollars
1966-01-01\t21000\tMSPUS\tQuarterly\tDollars
1966-04-01\t22100\tMSPUS\tQuarterly\tDollars
1966-07-01\t21500\tMSPUS\tQuarterly\tDollars
1966-10-01\t21400\tMSPUS\tQuarterly\tDollars
1967-01-01\t22300\tMSPUS\tQuarterly\tDollars
1967-04-01\t23300\tMSPUS\tQuarterly\tDollars
1967-07-01\t22500\tMSPUS\tQuarterly\tDollars
1967-10-01\t22900\tMSPUS\tQuarterly\tDollars
1968-01-01\t23900\tMSPUS\tQuarterly\tDollars
1968-04-01\t24900\tMSPUS\tQuarterly\tDollars
1968-07-01\t24800\tMSPUS\tQuarterly\tDollars
1968-10-01\t25600\tMSPUS\tQuarterly\tDollars
1969-01-01\t25700\tMSPUS\tQuarterly\tDollars
1969-04-01\t25900\tMSPUS\tQuarterly\tDollars
1969-07-01\t25900\tMSPUS\tQuarterly\tDollars
1969-10-01\t24900\tMSPUS\tQuarterly\tDollars
1970-01-01\t23900\tMSPUS\tQuarterly\tDollars
1970-04-01\t24400\tMSPUS\tQuarterly\tDollars
1970-07-01\t23000\tMSPUS\tQuarterly\tDollars
1970-10-01\t22600\tMSPUS\tQuarterly\tDollars
1971-01-01\t24300\tMSPUS\tQuarterly\tDollars
1971-04-01\t25800\tMSPUS\tQuarterly\tDollars
1971-07-01\t25300\tMSPUS\tQuarterly\tDollars
1971-10-01\t25500\tMSPUS\tQuarterly\tDollars
1972-01-01\t26200\tMSPUS\tQuarterly\tDollars
1972-04-01\t26800\tMSPUS\tQuarterly\tDollars
1972-07-01\t27900\tMSPUS\tQuarterly\tDollars
1972-10-01\t29200\tMSPUS\tQuarterly\tDollars
1973-01-01\t30200\tMSPUS\tQuarterly\tDollars
1973-04-01\t32700\tMSPUS\tQuarterly\tDollars
1973-07-01\t33500\tMSPUS\tQuarterly\tDollars
1973-10-01\t34000\tMSPUS\tQuarterly\tDollars
1974-01-01\t35200\tMSPUS\tQuarterly\tDollars
1974-04-01\t35600\tMSPUS\tQuarterly\tDollars
1974-07-01\t36200\tMSPUS\tQuarterly\tDollars
1974-10-01\t37200\tMSPUS\tQuarterly\tDollars
1975-01-01\t38100\tMSPUS\tQuarterly\tDollars
1975-04-01\t39000\tMSPUS\tQuarterly\tDollars
1975-07-01\t38800\tMSPUS\tQuarterly\tDollars
1975-10-01\t41200\tMSPUS\tQuarterly\tDollars
1976-01-01\t42800\tMSPUS\tQuarterly\tDollars
1976-04-01\t44200\tMSPUS\tQuarterly\tDollars
1976-07-01\t44400\tMSPUS\tQuarterly\tDollars
1976-10-01\t45500\tMSPUS\tQuarterly\tDollars
1977-01-01\t46300\tMSPUS\tQuarterly\tDollars
1977-04-01\t48900\tMSPUS\tQuarterly\tDollars
1977-07-01\t48800\tMSPUS\tQuarterly\tDollars
1977-10-01\t51600\tMSPUS\tQuarterly\tDollars
1978-01-01\t53000\tMSPUS\tQuarterly\tDollars
1978-04-01\t55300\tMSPUS\tQuarterly\tDollars
1978-07-01\t56100\tMSPUS\tQuarterly\tDollars
1978-10-01\t59000\tMSPUS\tQuarterly\tDollars
1979-01-01\t60600\tMSPUS\tQuarterly\tDollars
1979-04-01\t63100\tMSPUS\tQuarterly\tDollars
1979-07-01\t64700\tMSPUS\tQuarterly\tDollars
1979-10-01\t62600\tMSPUS\tQuarterly\tDollars
1980-01-01\t63700\tMSPUS\tQuarterly\tDollars
1980-04-01\t64000\tMSPUS\tQuarterly\tDollars
1980-07-01\t64900\tMSPUS\tQuarterly\tDollars
1980-10-01\t66400\tMSPUS\tQuarterly\tDollars
1981-01-01\t66800\tMSPUS\tQuarterly\tDollars
1981-04-01\t69400\tMSPUS\tQuarterly\tDollars
1981-07-01\t69200\tMSPUS\tQuarterly\tDollars
1981-10-01\t70400\tMSPUS\tQuarterly\tDollars
1982-01-01\t66400\tMSPUS\tQuarterly\tDollars
1982-04-01\t69600\tMSPUS\tQuarterly\tDollars
1982-07-01\t69300\tMSPUS\tQuarterly\tDollars
1982-10-01\t71600\tMSPUS\tQuarterly\tDollars
1983-01-01\t73300\tMSPUS\tQuarterly\tDollars
1983-04-01\t74900\tMSPUS\tQuarterly\tDollars
1983-07-01\t77400\tMSPUS\tQuarterly\tDollars
1983-10-01\t75900\tMSPUS\tQuarterly\tDollars
1984-01-01\t78200\tMSPUS\tQuarterly\tDollars
1984-04-01\t80700\tMSPUS\tQuarterly\tDollars
1984-07-01\t81000\tMSPUS\tQuarterly\tDollars
1984-10-01\t79900\tMSPUS\tQuarterly\tDollars
1985-01-01\t82800\tMSPUS\tQuarterly\tDollars
1985-04-01\t84300\tMSPUS\tQuarterly\tDollars
1985-07-01\t83200\tMSPUS\tQuarterly\tDollars
1985-10-01\t86800\tMSPUS\tQuarterly\tDollars
1986-01-01\t88000\tMSPUS\tQuarterly\tDollars
1986-04-01\t92100\tMSPUS\tQuarterly\tDollars
1986-07-01\t93000\tMSPUS\tQuarterly\tDollars
1986-10-01\t95000\tMSPUS\tQuarterly\tDollars
1987-01-01\t97900\tMSPUS\tQuarterly\tDollars
1987-04-01\t103400\tMSPUS\tQuarterly\tDollars
1987-07-01\t106000\tMSPUS\tQuarterly\tDollars
1987-10-01\t111500\tMSPUS\tQuarterly\tDollars
1988-01-01\t110000\tMSPUS\tQuarterly\tDollars
1988-04-01\t110000\tMSPUS\tQuarterly\tDollars
1988-07-01\t115000\tMSPUS\tQuarterly\tDollars
1988-10-01\t113900\tMSPUS\tQuarterly\tDollars
1989-01-01\t118000\tMSPUS\tQuarterly\tDollars
1989-04-01\t118900\tMSPUS\tQuarterly\tDollars
1989-07-01\t120000\tMSPUS\tQuarterly\tDollars
1989-10-01\t124800\tMSPUS\tQuarterly\tDollars
1990-01-01\t123900\tMSPUS\tQuarterly\tDollars
1990-04-01\t126800\tMSPUS\tQuarterly\tDollars
1990-07-01\t117000\tMSPUS\tQuarterly\tDollars
1990-10-01\t121500\tMSPUS\tQuarterly\tDollars
1991-01-01\t120000\tMSPUS\tQuarterly\tDollars
1991-04-01\t119900\tMSPUS\tQuarterly\tDollars
1991-07-01\t120000\tMSPUS\tQuarterly\tDollars
1991-10-01\t120000\tMSPUS\tQuarterly\tDollars
1992-01-01\t119500\tMSPUS\tQuarterly\tDollars
1992-04-01\t120000\tMSPUS\tQuarterly\tDollars
1992-07-01\t120000\tMSPUS\tQuarterly\tDollars
1992-10-01\t126000\tMSPUS\tQuarterly\tDollars
1993-01-01\t125000\tMSPUS\tQuarterly\tDollars
1993-04-01\t127000\tMSPUS\tQuarterly\tDollars
1993-07-01\t127000\tMSPUS\tQuarterly\tDollars
1993-10-01\t127000\tMSPUS\tQuarterly\tDollars
1994-01-01\t130000\tMSPUS\tQuarterly\tDollars
1994-04-01\t130000\tMSPUS\tQuarterly\tDollars
1994-07-01\t129700\tMSPUS\tQuarterly\tDollars
1994-10-01\t132000\tMSPUS\tQuarterly\tDollars
1995-01-01\t130000\tMSPUS\tQuarterly\tDollars
1995-04-01\t133900\tMSPUS\tQuarterly\tDollars
1995-07-01\t132000\tMSPUS\tQuarterly\tDollars
1995-10-01\t138000\tMSPUS\tQuarterly\tDollars
1996-01-01\t137000\tMSPUS\tQuarterly\tDollars
1996-04-01\t139900\tMSPUS\tQuarterly\tDollars
1996-07-01\t140000\tMSPUS\tQuarterly\tDollars
1996-10-01\t144100\tMSPUS\tQuarterly\tDollars
1997-01-01\t145000\tMSPUS\tQuarterly\tDollars
1997-04-01\t145800\tMSPUS\tQuarterly\tDollars
1997-07-01\t145000\tMSPUS\tQuarterly\tDollars
1997-10-01\t144200\tMSPUS\tQuarterly\tDollars
1998-01-01\t152200\tMSPUS\tQuarterly\tDollars
1998-04-01\t149500\tMSPUS\tQuarterly\tDollars
1998-07-01\t153000\tMSPUS\tQuarterly\tDollars
1998-10-01\t153000\tMSPUS\tQuarterly\tDollars
1999-01-01\t157400\tMSPUS\tQuarterly\tDollars
1999-04-01\t158700\tMSPUS\tQuarterly\tDollars
1999-07-01\t159100\tMSPUS\tQuarterly\tDollars
1999-10-01\t165300\tMSPUS\tQuarterly\tDollars
2000-01-01\t165300\tMSPUS\tQuarterly\tDollars
2000-04-01\t163200\tMSPUS\tQuarterly\tDollars
2000-07-01\t168800\tMSPUS\tQuarterly\tDollars
2000-10-01\t172900\tMSPUS\tQuarterly\tDollars
2001-01-01\t169800\tMSPUS\tQuarterly\tDollars
2001-04-01\t179000\tMSPUS\tQuarterly\tDollars
2001-07-01\t172500\tMSPUS\tQuarterly\tDollars
2001-10-01\t171100\tMSPUS\tQuarterly\tDollars
2002-01-01\t188700\tMSPUS\tQuarterly\tDollars
2002-04-01\t187200\tMSPUS\tQuarterly\tDollars
2002-07-01\t178100\tMSPUS\tQuarterly\tDollars
2002-10-01\t190100\tMSPUS\tQuarterly\tDollars
2003-01-01\t186000\tMSPUS\tQuarterly\tDollars
2003-04-01\t191800\tMSPUS\tQuarterly\tDollars
2003-07-01\t191900\tMSPUS\tQuarterly\tDollars
2003-10-01\t198800\tMSPUS\tQuarterly\tDollars
2004-01-01\t212700\tMSPUS\tQuarterly\tDollars
2004-04-01\t217600\tMSPUS\tQuarterly\tDollars
2004-07-01\t213500\tMSPUS\tQuarterly\tDollars
2004-10-01\t228800\tMSPUS\tQuarterly\tDollars
2005-01-01\t232500\tMSPUS\tQuarterly\tDollars
2005-04-01\t233700\tMSPUS\tQuarterly\tDollars
2005-07-01\t236400\tMSPUS\tQuarterly\tDollars
2005-10-01\t243600\tMSPUS\tQuarterly\tDollars
2006-01-01\t247700\tMSPUS\tQuarterly\tDollars
2006-04-01\t246300\tMSPUS\tQuarterly\tDollars
2006-07-01\t235600\tMSPUS\tQuarterly\tDollars
2006-10-01\t245400\tMSPUS\tQuarterly\tDollars
2007-01-01\t257400\tMSPUS\tQuarterly\tDollars
2007-04-01\t242200\tMSPUS\tQuarterly\tDollars
2007-07-01\t241800\tMSPUS\tQuarterly\tDollars
2007-10-01\t238400\tMSPUS\tQuarterly\tDollars
2008-01-01\t233900\tMSPUS\tQuarterly\tDollars
2008-04-01\t235300\tMSPUS\tQuarterly\tDollars
2008-07-01\t226500\tMSPUS\tQuarterly\tDollars
2008-10-01\t222500\tMSPUS\tQuarterly\tDollars
2009-01-01\t208400\tMSPUS\tQuarterly\tDollars
2009-04-01\t220900\tMSPUS\tQuarterly\tDollars
2009-07-01\t214300\tMSPUS\tQuarterly\tDollars
2009-10-01\t219000\tMSPUS\tQuarterly\tDollars
2010-01-01\t222900\tMSPUS\tQuarterly\tDollars
2010-04-01\t219500\tMSPUS\tQuarterly\tDollars
2010-07-01\t224100\tMSPUS\tQuarterly\tDollars
2010-10-01\t224300\tMSPUS\tQuarterly\tDollars
2011-01-01\t226900\tMSPUS\tQuarterly\tDollars
2011-04-01\t228100\tMSPUS\tQuarterly\tDollars
2011-07-01\t223500\tMSPUS\tQuarterly\tDollars
2011-10-01\t221100\tMSPUS\tQuarterly\tDollars
2012-01-01\t238400\tMSPUS\tQuarterly\tDollars
2012-04-01\t238700\tMSPUS\tQuarterly\tDollars
2012-07-01\t248800\tMSPUS\tQuarterly\tDollars
2012-10-01\t251700\tMSPUS\tQuarterly\tDollars
2013-01-01\t258400\tMSPUS\tQuarterly\tDollars
2013-04-01\t268100\tMSPUS\tQuarterly\tDollars
2013-07-01\t264800\tMSPUS\tQuarterly\tDollars
2013-10-01\t273600\tMSPUS\tQuarterly\tDollars
2014-01-01\t275200\tMSPUS\tQuarterly\tDollars
2014-04-01\t288000\tMSPUS\tQuarterly\tDollars
2014-07-01\t281000\tMSPUS\tQuarterly\tDollars
2014-10-01\t298900\tMSPUS\tQuarterly\tDollars
2015-01-01\t289200\tMSPUS\tQuarterly\tDollars
2015-04-01\t289100\tMSPUS\tQuarterly\tDollars
2015-07-01\t295800\tMSPUS\tQuarterly\tDollars
2015-10-01\t302500\tMSPUS\tQuarterly\tDollars
2016-01-01\t299800\tMSPUS\tQuarterly\tDollars
2016-04-01\t306000\tMSPUS\tQuarterly\tDollars
2016-07-01\t303800\tMSPUS\tQuarterly\tDollars
2016-10-01\t310900\tMSPUS\tQuarterly\tDollars
2017-01-01\t313100\tMSPUS\tQuarterly\tDollars
2017-04-01\t318200\tMSPUS\tQuarterly\tDollars
2017-07-01\t320500\tMSPUS\tQuarterly\tDollars
2017-10-01\t337900\tMSPUS\tQuarterly\tDollars
2018-01-01\t331800\tMSPUS\tQuarterly\tDollars
2018-04-01\t315600\tMSPUS\tQuarterly\tDollars
2018-07-01\t330900\tMSPUS\tQuarterly\tDollars
2018-10-01\t322800\tMSPUS\tQuarterly\tDollars
2019-01-01\t313000\tMSPUS\tQuarterly\tDollars
2019-04-01\t322500\tMSPUS\tQuarterly\tDollars
2019-07-01\t318400\tMSPUS\tQuarterly\tDollars
2019-10-01\t327100\tMSPUS\tQuarterly\tDollars
2020-01-01\t329000\tMSPUS\tQuarterly\tDollars
2020-04-01\t317100\tMSPUS\tQuarterly\tDollars
2020-07-01\t327900\tMSPUS\tQuarterly\tDollars
2020-10-01\t338600\tMSPUS\tQuarterly\tDollars
2021-01-01\t355000\tMSPUS\tQuarterly\tDollars
2021-04-01\t367800\tMSPUS\tQuarterly\tDollars
2021-07-01\t395200\tMSPUS\tQuarterly\tDollars
2021-10-01\t414000\tMSPUS\tQuarterly\tDollars
2022-01-01\t413500\tMSPUS\tQuarterly\tDollars
2022-04-01\t437700\tMSPUS\tQuarterly\tDollars
2022-07-01\t438000\tMSPUS\tQuarterly\tDollars
2022-10-01\t442600\tMSPUS\tQuarterly\tDollars
2023-01-01\t429000\tMSPUS\tQuarterly\tDollars
2023-04-01\t418500\tMSPUS\tQuarterly\tDollars
2023-07-01\t435400\tMSPUS\tQuarterly\tDollars
2023-10-01\t423200\tMSPUS\tQuarterly\tDollars
2024-01-01\t426800\tMSPUS\tQuarterly\tDollars
2024-04-01\t414500\tMSPUS\tQuarterly\tDollars
2024-07-01\t415300\tMSPUS\tQuarterly\tDollars
2024-10-01\t419300\tMSPUS\tQuarterly\tDollars
2025-01-01\t423100\tMSPUS\tQuarterly\tDollars
2025-04-01\t410800\tMSPUS\tQuarterly\tDollars
`;

async function loadHomePriceChart() {
  if (!elements.homePriceChart) {
    return;
  }
  try {
    const useEmbedded = window.location.protocol === "file:";
    const text = useEmbedded
      ? HOME_PRICE_CSV
      : await (await fetch("data/home_prices.csv")).text();
    const rows = parseHomePriceCsv(text || HOME_PRICE_CSV);
    renderLineChart(elements.homePriceChart, rows);
  } catch (error) {
    const rows = parseHomePriceCsv(HOME_PRICE_CSV);
    renderLineChart(elements.homePriceChart, rows);
  }
}

async function loadMoneySupplyChart() {
  if (!elements.chartMoneySupply) {
    return;
  }
  setChartStatus("chartStatusMoneySupply", "Loading data...");
  try {
    const baseYear = 1971;
    const [m2Rows, cpiRows] = await Promise.all([
      fetchFredSeries(FRED_SERIES.m2),
      fetchFredSeries(FRED_SERIES.cpi),
    ]);
    const m2Change = percentChangeSeries(
      filterFromYear(m2Rows, baseYear),
      baseYear
    );
    const purchasingPowerChange = percentChangeSeries(
      filterFromYear(cpiRows, baseYear),
      baseYear,
      true
    );
    renderDualAxisChart(
      elements.chartMoneySupply,
      { rows: purchasingPowerChange.rows, color: CHART_COLORS.purchasingPower },
      { rows: m2Change.rows, color: CHART_COLORS.m2 },
      {
        labelFormatter: (value) => `${formatNumber(value, 0)}%`,
        leftAxisLabel: "Purchasing power",
        rightAxisLabel: "Money supply",
      }
    );
    renderDualAxisChart(
      elements.chartMoneySupplyClone,
      { rows: purchasingPowerChange.rows, color: CHART_COLORS.purchasingPower },
      { rows: m2Change.rows, color: CHART_COLORS.m2 },
      {
        labelFormatter: (value) => `${formatNumber(value, 0)}%`,
        leftAxisLabel: "Purchasing power",
        rightAxisLabel: "Money supply",
      }
    );
    setChartStatus("chartStatusMoneySupply", "");
  } catch (error) {
    renderEmptyChart(elements.chartMoneySupply, "Data unavailable");
    setChartStatus("chartStatusMoneySupply", "Data unavailable. Start python3 server.py.");
  }
}

async function loadAssetWageChart() {
  if (!elements.chartAssetWages) {
    return;
  }
  setChartStatus("chartStatusAssetWages", "Loading data...");
  try {
    const baseYear = 1971;
    const [incomeRows, homeRows] = await Promise.all([
      fetchFredSeries(FRED_SERIES.income),
      fetchFredSeries(FRED_SERIES.home),
    ]);
    const incomeIndexed = indexSeries(filterFromYear(incomeRows, baseYear), baseYear);
    const homeIndexed = indexSeries(filterFromYear(homeRows, baseYear), baseYear);
    renderChartPair(
      elements.chartAssetWages,
      elements.chartAssetWagesClone,
      [
        { rows: incomeIndexed.rows, color: CHART_COLORS.wages },
        { rows: homeIndexed.rows, color: CHART_COLORS.home },
      ]
    );
    const statusParts = [];
    if (incomeIndexed.baseYearUsed && incomeIndexed.baseYearUsed !== baseYear) {
      statusParts.push(`Income series starts ${incomeIndexed.baseYearUsed}.`);
    }
    setChartStatus("chartStatusAssetWages", statusParts.join(" "));
  } catch (error) {
    renderEmptyChart(elements.chartAssetWages, "Data unavailable");
    setChartStatus("chartStatusAssetWages", "Data unavailable. Start python3 server.py.");
  }
}

async function loadPurchasingPowerChart() {
  if (!elements.chartPurchasingPower) {
    return;
  }
  setChartStatus("chartStatusPurchasingPower", "Loading data...");
  try {
    const baseYear = 1971;
    const cpiRows = await fetchFredSeries(FRED_SERIES.cpi);
    const purchasingPower = computePurchasingPower(
      filterFromYear(cpiRows, baseYear),
      baseYear
    );
    renderChartPair(
      elements.chartPurchasingPower,
      elements.chartPurchasingPowerClone,
      [{ rows: purchasingPower.rows, color: CHART_COLORS.purchasingPower }]
    );
    const last = purchasingPower.rows[purchasingPower.rows.length - 1];
    const status = last ? `Latest: ${formatNumber(last.value, 0)} cents.` : "";
    setChartStatus("chartStatusPurchasingPower", status);
  } catch (error) {
    renderEmptyChart(elements.chartPurchasingPower, "Data unavailable");
    setChartStatus("chartStatusPurchasingPower", "Data unavailable. Start python3 server.py.");
  }
}

async function loadFedBalanceChart() {
  if (!elements.chartFedBalance) {
    return;
  }
  setChartStatus("chartStatusFedBalance", "Loading data...");
  try {
    const baseYear = 1971;
    const balanceRows = await fetchFredSeries(FRED_SERIES.fedBalance);
    const filtered = filterFromYear(balanceRows, baseYear);
    renderChartPair(
      elements.chartFedBalance,
      elements.chartFedBalanceClone,
      [{ rows: filtered, color: CHART_COLORS.fedBalance, step: true }],
      {
        labelFormatter: (value) => `$${formatNumber(value / 1000000, 1)}T`,
        eventMarkers: [
          { year: 2008, label: "2008" },
          { year: 2020, label: "2020" },
        ],
      }
    );
    setChartStatus("chartStatusFedBalance", "");
  } catch (error) {
    renderEmptyChart(elements.chartFedBalance, "Data unavailable");
    setChartStatus("chartStatusFedBalance", "Data unavailable. Start python3 server.py.");
  }
}

async function loadRealRatesChart() {
  if (!elements.chartRealRates) {
    return;
  }
  setChartStatus("chartStatusRealRates", "Loading data...");
  try {
    const baseYear = 1971;
    const [cpiRows, fedFundsRows] = await Promise.all([
      fetchFredSeries(FRED_SERIES.cpi),
      fetchFredSeries(FRED_SERIES.fedFunds),
    ]);
    const inflationRows = computeYoYInflation(filterFromYear(cpiRows, baseYear));
    const fedFunds = filterFromYear(fedFundsRows, baseYear);
    const fedByMonth = new Map();
    fedFunds.forEach((row) => {
      const key = `${row.date.getFullYear()}-${row.date.getMonth()}`;
      fedByMonth.set(key, row.value);
    });
    const realRateRows = [];
    inflationRows.forEach((row) => {
      const key = `${row.date.getFullYear()}-${row.date.getMonth()}`;
      const fedValue = fedByMonth.get(key);
      if (fedValue === undefined) {
        return;
      }
      realRateRows.push({ date: row.date, value: row.value - fedValue });
    });
    renderChartPair(
      elements.chartRealRates,
      elements.chartRealRatesClone,
      [{ rows: realRateRows, color: CHART_COLORS.realRate }],
      { includeZero: true, zeroLine: true }
    );
    setChartStatus("chartStatusRealRates", "Negative values are below zero.");
  } catch (error) {
    renderEmptyChart(elements.chartRealRates, "Data unavailable");
    setChartStatus("chartStatusRealRates", "Data unavailable. Start python3 server.py.");
  }
}

async function loadMacroCharts() {
  await Promise.all([
    loadMoneySupplyChart(),
    loadAssetWageChart(),
    loadPurchasingPowerChart(),
    loadFedBalanceChart(),
    loadRealRatesChart(),
  ]);
}
async function updateDashboard() {
  const selectedId = elements.currencySelect ? elements.currencySelect.value : "us";
  const country = countries.find((entry) => entry.id === selectedId);
  if (!country) {
    return;
  }

  const marketData = await fetchMarketData(country);
  const debasement = calculateConstitutionalDebasement(marketData.silverPrice);
  const goldInflation = calculateGoldInflation(marketData.goldPrice);
  elements.debasementPercent.textContent = formatPercent(debasement.percent);
  if (elements.debasementDetail) {
    elements.debasementDetail.textContent = "View chart";
    elements.debasementDetail.setAttribute("href", "#chart-silver");
  }
  const goldPercent = document.getElementById("goldInflationPercent");
  const goldDetail = document.getElementById("goldInflationDetail");
  if (goldPercent && goldDetail) {
    goldPercent.textContent = formatPercent(goldInflation.percent);
    goldDetail.textContent = "View chart";
    goldDetail.setAttribute("href", "#chart-gold");
  }

  renderEvents(country);
  renderTimeline(country);
  lastMarketData = marketData;
  renderCoinGrid(COIN_CATALOG, marketData);

  if (elements.silverPrice) {
    elements.silverPrice.textContent = marketData.silverPrice
      ? formatNumber(marketData.silverPrice, 2)
      : "-";
  }
  if (elements.goldPrice) {
    elements.goldPrice.textContent = marketData.goldPrice
      ? formatNumber(marketData.goldPrice, 2)
      : "-";
  }
  if (elements.silverDollarNow && elements.goldDollarNow) {
    const silverNow = marketData.silverPrice
      ? marketData.silverPrice * COINAGE_1792.silverDollarOz
      : null;
    const goldNow = marketData.goldPrice
      ? marketData.goldPrice * COINAGE_1792.goldDollarOz
      : null;
    elements.silverDollarNow.textContent = silverNow
      ? `$${formatNumber(silverNow, 2)}`
      : "-";
    elements.goldDollarNow.textContent = goldNow
      ? `$${formatNumber(goldNow, 2)}`
      : "-";
  }

  const ratios = calculateRatios(
    country,
    marketData.silverPrice,
    marketData.goldPrice,
    marketData.fxRate
  );
  if (elements.homeOz) {
    elements.homeOz.textContent = ratios.homeOz ? formatNumber(ratios.homeOz, 2) : "-";
  }
  if (elements.wageOz) {
    elements.wageOz.textContent = ratios.wageOz ? formatNumber(ratios.wageOz, 2) : "-";
  }
  if (elements.homeWageRatio) {
    elements.homeWageRatio.textContent = ratios.ratio ? formatNumber(ratios.ratio, 2) : "-";
  }
  if (elements.homeOzGold) {
    elements.homeOzGold.textContent = ratios.homeOzGold
      ? formatNumber(ratios.homeOzGold, 2)
      : "-";
  }
  if (elements.wageOzGold) {
    elements.wageOzGold.textContent = ratios.wageOzGold
      ? formatNumber(ratios.wageOzGold, 2)
      : "-";
  }
  if (elements.homeWageRatioGold) {
    elements.homeWageRatioGold.textContent = ratios.ratioGold
      ? formatNumber(ratios.ratioGold, 2)
      : "-";
  }
  if (elements.ratioNote) {
    elements.ratioNote.textContent = `Prices in ${country.currencySymbol}. FX source: exchangerate.host.`;
  }
}

function bindEvents() {
  if (elements.currencySelect) {
    elements.currencySelect.addEventListener("change", () => {
      updateDashboard();
    });
  }
}

function bindHeaderCollapse() {
  const threshold = 80;
  const onScroll = () => {
    const shouldCollapse = window.scrollY > threshold;
    document.body.classList.toggle("collapsed", shouldCollapse);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function centerMerchPreview() {
  const grid = document.querySelector(".merch-grid");
  const target = document.querySelector(".merch-feature");
  if (!grid || !target) {
    return;
  }
  const targetCenter = target.offsetLeft + target.offsetWidth / 2;
  const scrollLeft = Math.max(0, targetCenter - grid.clientWidth / 2);
  grid.scrollLeft = scrollLeft;
}

function closeChartModal() {
  if (!elements.chartModal) {
    return;
  }
  elements.chartModal.classList.remove("is-open");
  elements.chartModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("charts-modal-open");
  if (elements.chartModalCanvas) {
    elements.chartModalCanvas.innerHTML = "";
  }
}

function openChartModal(card) {
  if (!elements.chartModal || !card) {
    return;
  }
  const chartId = card.getAttribute("data-chart-id");
  if (!chartId) {
    return;
  }
  const sourceSvg = document.getElementById(chartId);
  if (!sourceSvg) {
    return;
  }
  const title = card.querySelector(".album-title");
  const sub = card.querySelector(".album-sub");
  const source = card.querySelector(".chart-source");

  elements.chartModalTitle.textContent = title ? title.textContent : "";
  elements.chartModalSub.textContent = sub ? sub.textContent : "";
  elements.chartModalSource.textContent = source ? source.textContent : "";

  if (elements.chartModalCanvas) {
    elements.chartModalCanvas.innerHTML = "";
    const clone = sourceSvg.cloneNode(true);
    clone.removeAttribute("id");
    elements.chartModalCanvas.appendChild(clone);
  }

  elements.chartModal.classList.add("is-open");
  elements.chartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("charts-modal-open");
}

function bindChartModal() {
  const album = document.querySelector(".chart-album");
  if (!album) {
    return;
  }
  album.addEventListener("click", (event) => {
    const card = event.target.closest(".album-card");
    if (!card) {
      return;
    }
    openChartModal(card);
  });

  if (elements.chartModal) {
    elements.chartModal.addEventListener("click", (event) => {
      if (event.target && event.target.matches("[data-chart-close]")) {
        closeChartModal();
      }
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeChartModal();
    }
  });
}

function init() {
  populateCurrencies();
  bindEvents();
  bindHeaderCollapse();
  bindChartModal();
  window.addEventListener("load", () => {
    centerMerchPreview();
  });
  window.addEventListener("resize", centerMerchPreview);
  updateDashboard();
  loadMacroCharts();
  setInterval(updateDashboard, config.refreshMs);
}

init();
