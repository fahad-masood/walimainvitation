import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Test the actual static output that guests receive, rather than the source data.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const html = await readFile(resolve(dist, "index.html"), "utf8");
const directions = "https://maps.app.goo.gl/p95MyD74HWYwa48u8";
const rsvpNames = [
  "Afroz Alam",
  "Anwar Alam",
  "Masood Alam",
  "Shahzad Alam",
  "Shahnawaz Alam",
  "Mohd Monis",
  "Shahmeer Alam",
];

function decodeEntities(value) {
  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi,
    (_, entity) => {
      if (entity.startsWith("#x"))
        return String.fromCodePoint(parseInt(entity.slice(2), 16));
      if (entity.startsWith("#"))
        return String.fromCodePoint(Number(entity.slice(1)));
      return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " }[
        entity.toLowerCase()
      ];
    },
  );
}

function visibleText(markup) {
  return decodeEntities(
    markup
      .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(
    /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
  )) {
    result[match[1].toLowerCase()] = decodeEntities(
      match[2] ?? match[3] ?? match[4] ?? "",
    );
  }
  return result;
}

const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
  (match) => ({ ...attributes(match[1]), text: visibleText(match[2]) }),
);
const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) =>
  attributes(match[0]),
);
const metadata = (key) =>
  meta.find((item) => item.property === key || item.name === key)?.content;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? filesIn(path) : [path];
    }),
  );
  return paths.flat();
}

function localAssetPath(url) {
  assert.ok(
    !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url),
    `Resource must be local: ${url}`,
  );
  const path = resolve(
    dist,
    url.startsWith("/") ? `.${url.split(/[?#]/)[0]}` : url.split(/[?#]/)[0],
  );
  assert.ok(
    path.startsWith(`${dist}/`),
    `Resource must stay inside the build: ${url}`,
  );
  return path;
}

test("the rendered invitation contains the approved couple, family and event details", () => {
  const text = visibleText(html);
  for (const expected of [
    "Daawat-e-Walima",
    "Fahad Masood",
    "Rahnuma Zarrin",
    "Mr. & Mrs. Masood Alam",
    "Beloved son of Mr. Masood Alam",
    "Beloved daughter of Mrs. Shamshad Begum",
    "15 November 2026",
    "6:00 PM",
    "onwards",
    "Indian Standard Time",
    "Regal Palace",
    "Asopur, Tanda, Ambedkar Nagar",
    "Uttar Pradesh, India",
  ])
    assert.ok(
      text.includes(expected),
      `Missing approved visible content: ${expected}`,
    );
  assert.match(html, /<html\b[^>]*\blang="en"/);
  assert.match(
    html,
    /<h1\b[^>]*>[\s\S]*?Fahad Masood[\s\S]*?Rahnuma Zarrin[\s\S]*?<\/h1>/,
  );
  assert.match(
    html,
    /<time\b[^>]*datetime="2026-11-15T18:00:00\+05:30"[^>]*>15 November 2026<\/time>/,
  );
  assert.equal(
    new Date("2026-11-15T00:00:00Z").getUTCDay(),
    0,
    "The event date is a Sunday",
  );
});

test("all seven RSVP names are visible text in the supplied order", () => {
  const section = html.match(
    /<section\b[^>]*aria-labelledby="rsvp-heading"[^>]*>([\s\S]*?)<\/section>/,
  );
  assert.ok(section, "The dedicated RSVP section must exist");
  assert.match(
    section[1],
    /<h2\b[^>]*id="rsvp-heading"[^>]*>R\.S\.V\.P\.<\/h2>/,
  );
  const listing = section[1].match(
    /<ul\b[^>]*class="rsvp-names"[^>]*>[\s\S]*?<\/ul>/,
  )?.[0];
  assert.ok(listing, "RSVP names need a semantic visible list");
  const names = [...listing.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map(
    (match) => visibleText(match[1]),
  );
  assert.deepEqual(
    names,
    rsvpNames,
    "Do not omit, reorder, replace or invent RSVP contacts",
  );
  assert.doesNotMatch(section[1], /<(?:a|button|input|form)\b/i);
  assert.doesNotMatch(listing, /\b(?:hidden|aria-hidden="true")\b/i);
});

test("directions and calendar use accessible, native links and no sharing UI", () => {
  const maps = anchors.find((anchor) => anchor.text === "Get Directions");
  assert.ok(maps, "The directions action needs a visible accessible name");
  assert.equal(maps.href, directions);
  assert.equal(maps.target, "_blank");
  assert.ok(maps.rel?.split(/\s+/).includes("noopener"));
  const calendar = anchors.find((anchor) => anchor.text === "Add to Calendar");
  assert.ok(calendar, "The calendar action needs a visible accessible name");
  assert.equal(calendar.href, "/walima.ics");
  assert.ok(
    calendar.download?.endsWith(".ics"),
    "Use a downloadable calendar file",
  );
  assert.doesNotMatch(
    html,
    /share invitation|whatsapp|wa\.me|api\.whatsapp|navigator\.share|tel:|mailto:/i,
  );
  assert.doesNotMatch(
    html,
    /<(?:form|input|iframe|audio|video|script|astro-island)\b|\bonclick\s*=/i,
    "Content and actions must work without scripts, hydration, or a backend",
  );
});

test("Arabic passages remain text with the correct direction and explicit Quranic attributions", () => {
  const arabic = [...html.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)]
    .map((match) => ({
      attrs: attributes(match[1]),
      text: visibleText(match[2]),
    }))
    .filter((item) => item.attrs.lang === "ar");
  assert.deepEqual(
    arabic.map((item) => item.text),
    [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
      "وَخَلَقْنَاكُمْ أَزْوَاجًا",
    ],
  );
  for (const passage of arabic) assert.equal(passage.attrs.dir, "rtl");
  const text = visibleText(html);
  assert.ok(
    text.includes(
      "In the Name of Allah, the Most Gracious, the Most Merciful.",
    ),
  );
  assert.ok(
    text.includes("An excerpt from the translation of Surah Ar-Rum (30:21)"),
  );
  assert.ok(text.includes("A translation of Surah An-Naba (78:8)"));
  assert.doesNotMatch(text, /(?:al[- ]?)?furq?an/i);
});

test("social metadata describes only this invitation and has a real 1200 × 630 PNG preview", async () => {
  assert.match(
    metadata("description"),
    /Daawat-e-Walima.*Fahad Masood.*Rahnuma Zarrin.*15 November 2026.*6:00 PM IST/,
  );
  assert.equal(metadata("og:title"), "Daawat-e-Walima · Fahad & Rahnuma");
  assert.match(
    metadata("og:description"),
    /Sunday, 15 November 2026.*6:00 PM IST onwards.*Regal Palace, Asopur, Tanda/,
  );
  assert.equal(metadata("og:image:width"), "1200");
  assert.equal(metadata("og:image:height"), "630");
  assert.equal(metadata("og:image:type"), "image/png");
  assert.equal(metadata("twitter:card"), "summary_large_image");
  assert.match(metadata("robots"), /noindex/);
  assert.ok(metadata("og:image")?.endsWith("/og-preview.png"));
  assert.equal(metadata("twitter:image"), metadata("og:image"));
  const png = await readFile(resolve(dist, "og-preview.png"));
  assert.deepEqual(
    png.subarray(0, 8),
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  assert.equal(png.toString("ascii", 12, 16), "IHDR");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(png.length > 1000, "The social image must contain image data");
  const unrelatedEvent = new RegExp(["ni", "kah"].join(""), "i");
  for (const path of await filesIn(dist)) {
    if (/\.(?:html|css|svg|ics|js|json|txt|xml)$/.test(path)) {
      assert.doesNotMatch(
        await readFile(path, "utf8"),
        unrelatedEvent,
        `Unrelated event exposed in ${path}`,
      );
    }
  }
});

test("fonts and render resources are self-hosted and the shared palette is present", async () => {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) =>
    attributes(match[0]),
  );
  const cssPaths = links
    .filter((link) => link.rel === "stylesheet")
    .map((link) => localAssetPath(link.href));
  assert.ok(
    cssPaths.length > 0,
    "The production page needs its compiled stylesheet",
  );
  const css = (
    await Promise.all(cssPaths.map((path) => readFile(path, "utf8")))
  ).join("\n");
  for (const color of [
    "#F7F4EC",
    "#183B36",
    "#B4965D",
    "#E6EFF1",
    "#FFFCF7",
    "#272C2A",
  ]) {
    assert.ok(
      css.toLowerCase().includes(color.toLowerCase()),
      `Missing shared palette color ${color}`,
    );
  }
  const faces = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)];
  assert.ok(
    faces.length >= 3,
    "Serif, sans-serif and Arabic fonts must be self-hosted",
  );
  for (const face of faces) assert.match(face[1], /font-display\s*:\s*swap/);
  assert.doesNotMatch(css, /@import\s+(?:url\()?\s*['"]?(?:https?:)?\/\//i);
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    assert.ok(
      (await readFile(localAssetPath(match[1]))).length > 0,
      `Missing resource: ${match[1]}`,
    );
  }
  for (const link of links.filter((link) =>
    ["stylesheet", "preload", "icon"].includes(link.rel),
  )) {
    assert.ok(
      (await readFile(localAssetPath(link.href))).length > 0,
      `Missing resource: ${link.href}`,
    );
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const image = attributes(match[0]);
    assert.ok((await readFile(localAssetPath(image.src))).length > 0);
    assert.ok(
      Number(image.width) > 0 && Number(image.height) > 0,
      "Images reserve their layout dimensions",
    );
    assert.ok(
      Object.hasOwn(image, "alt"),
      "Decorative images need empty alt text",
    );
  }
});

test("the calendar is correctly folded UTF-8 with escaped text and an exact local start", async () => {
  const bytes = await readFile(resolve(dist, "walima.ics"));
  const calendar = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  assert.ok(calendar.endsWith("\r\n"), "The calendar ends with CRLF");
  assert.doesNotMatch(
    calendar.replaceAll("\r\n", ""),
    /[\r\n]/,
    "No bare LF or CR line endings",
  );
  for (const line of calendar.slice(0, -2).split("\r\n")) {
    assert.ok(
      Buffer.byteLength(line, "utf8") <= 75,
      `Calendar physical line exceeds 75 octets: ${line}`,
    );
  }
  const unfolded = calendar.replace(/\r\n[ \t]/g, "");
  assert.ok(unfolded.startsWith("BEGIN:VCALENDAR\r\n"));
  assert.ok(unfolded.endsWith("END:VCALENDAR\r\n"));
  assert.match(unfolded, /BEGIN:VTIMEZONE\r\nTZID:Asia\/Kolkata\r\n/);
  assert.match(
    unfolded,
    /TZOFFSETFROM:\+0530\r\nTZOFFSETTO:\+0530\r\nTZNAME:IST\r\n/,
  );
  const events = [
    ...unfolded.matchAll(/BEGIN:VEVENT\r\n([\s\S]*?)END:VEVENT\r\n/g),
  ];
  assert.equal(
    events.length,
    1,
    "The calendar contains exactly one invitation event",
  );
  const event = events[0][1];
  assert.match(event, /^DTSTART;TZID=Asia\/Kolkata:20261115T180000\r?$/m);
  assert.doesNotMatch(
    event,
    /^(?:DTEND|DURATION|ATTENDEE|ORGANIZER|RRULE|RECURRENCE-ID)[:;]/m,
  );
  assert.match(event, /^UID:.+\r?$/m);
  assert.match(event, /^DTSTAMP:\d{8}T\d{6}Z\r?$/m);
  const property = (name) =>
    event.match(new RegExp(`^${name}:(.*)\\r?$`, "m"))?.[1].replace(/\r$/, "");
  const unescapeText = (text) =>
    text.replace(/\\([\\,;nN])/g, (_, value) =>
      /[nN]/.test(value) ? "\n" : value,
    );
  for (const name of ["SUMMARY", "DESCRIPTION", "LOCATION"]) {
    const value = property(name);
    assert.ok(value, `Missing calendar ${name}`);
    assert.doesNotMatch(
      value.replace(/\\[\\,;nN]/g, ""),
      /[,;\\]/,
      `${name} must escape RFC 5545 text characters`,
    );
  }
  assert.equal(
    unescapeText(property("SUMMARY")),
    "Daawat-e-Walima — Fahad Masood & Rahnuma Zarrin",
  );
  assert.equal(
    unescapeText(property("LOCATION")),
    "Regal Palace, Asopur, Tanda, Ambedkar Nagar, Uttar Pradesh, India",
  );
  assert.ok(
    unescapeText(property("DESCRIPTION")).includes(
      "Sunday, 15 November 2026 | 6:00 PM IST onwards.",
    ),
  );
  assert.equal(property("URL"), directions);
  const instant = new Date("2026-11-15T18:00:00+05:30");
  assert.equal(instant.toISOString(), "2026-11-15T12:30:00.000Z");
  assert.equal(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(instant),
    "18:00",
  );
});
