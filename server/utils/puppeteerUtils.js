const puppeteer = require("puppeteer");

exports.scrapeLinkedIn = async (companies) => {
  // const browser = await puppeteer.launch({ headless: true });
  const browser = await puppeteer.launch({
    args: ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"],
    headless: "new",
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  const results = [];

  for (const company of companies) {
    const data = await scrapeCompanyData(page, company);
    results.push(data);
  }

  await browser.close();
  return results;
};

async function scrapeCompanyData(page, company) {
  try {
    console.log(`Processing ${company}...`);
    const companyProfileLink = await getLinkedInCompanyPage(page, company);
    console.log(`LinkedIn Profile: ${companyProfileLink}`);

    const employeeCount = await getGoogleData(page, company, "employees");
    const followersCount = await getGoogleData(page, company, "followers");

    return {
      domain: company,
      linkedinProfile: companyProfileLink,
      employeeCount,
      followersCount,
    };
  } catch (error) {
    console.error(`Error scraping data for: ${company}`, error);
    return {
      domain: company,
      linkedinProfile: null,
      employeeCount: "0 employees",
      followersCount: "0 followers",
    };
  }
}

async function getLinkedInCompanyPage(page, domain) {
  await page.goto(
    `https://www.google.com/search?q=site:linkedin.com+${domain}`,
    { waitUntil: "networkidle2" }
  );
  await page.waitForSelector("h3");

  const companyProfileLink = await page.evaluate(() => {
    const linkElement = document.querySelector(
      'a[href*="linkedin.com/company"]'
    );
    return linkElement ? linkElement.href : null;
  });

  if (!companyProfileLink) {
    throw new Error("Company profile not found");
  }
  return companyProfileLink;
}

async function getGoogleData(page, domain, type) {
  await page.goto(
    `https://www.google.com/search?q=${domain}+linkedin+${type}+count`,
    { waitUntil: "networkidle2" }
  );
  await page.waitForSelector("#search");

  const count = await page.evaluate((type) => {
    const elements = Array.from(
      document.querySelectorAll(
        "div.VwiC3b.yXK7lf.lVm3ye.r025kc.hJNv6b.Hdw6tb span"
      )
    );
    for (const element of elements) {
      if (
        type === "employees" &&
        element.innerText.toLowerCase().includes("employees")
      ) {
        const match = element.innerText.match(/(\d[\d,]*)\s+employees/);
        if (match) {
          return match[1].replace(/,/g, "");
        }
      } else if (
        type === "followers" &&
        element.innerText.toLowerCase().includes("followers")
      ) {
        const match = element.innerText.match(/(\d[\d,]*)\s+followers/);
        if (match) {
          return match[1].replace(/,/g, "");
        }
      }
    }
    return "N/A";
  }, type);

  return count;
}
