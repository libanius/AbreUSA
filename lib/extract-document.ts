import OpenAI from "openai";

function getClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export type PassportExtraction = {
  fullName: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  passportNumber: string | null;
  passportExpiration: string | null;
};

export type AddressExtraction = {
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
};

export type ExtractionResult = {
  passport: PassportExtraction;
  address: AddressExtraction;
  confidence: number;
};

async function extractPassport(
  buffer: Buffer,
  mimeType: string,
): Promise<PassportExtraction> {
  const base64 = buffer.toString("base64");
  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a document data extraction assistant. Extract specific fields from passport images and return only valid JSON. Return null for any field that cannot be clearly read.",
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64}`, detail: "high" },
          },
          {
            type: "text",
            text: `Extract these fields from this passport and return ONLY this JSON:
{"fullName":"full name as printed or null","dateOfBirth":"YYYY-MM-DD or null","nationality":"country in Portuguese e.g. Brasileira or null","passportNumber":"passport number or null","passportExpiration":"YYYY-MM-DD or null"}`,
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  try {
    const raw = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    return {
      fullName: raw.fullName ?? null,
      dateOfBirth: raw.dateOfBirth ?? null,
      nationality: raw.nationality ?? null,
      passportNumber: raw.passportNumber ?? null,
      passportExpiration: raw.passportExpiration ?? null,
    };
  } catch {
    return { fullName: null, dateOfBirth: null, nationality: null, passportNumber: null, passportExpiration: null };
  }
}

async function extractAddress(
  buffer: Buffer,
  mimeType: string,
): Promise<AddressExtraction> {
  const base64 = buffer.toString("base64");
  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a document data extraction assistant. Extract US address information from documents like utility bills, bank statements, and leases. Return only valid JSON. Return null for fields that cannot be clearly read.",
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64}`, detail: "high" },
          },
          {
            type: "text",
            text: `Extract the US address from this document and return ONLY this JSON:
{"streetAddress":"street and number or null","city":"city name or null","state":"2-letter US state code e.g. FL or null","zipCode":"5-digit ZIP or null"}`,
          },
        ],
      },
    ],
    max_tokens: 200,
  });

  try {
    const raw = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    return {
      streetAddress: raw.streetAddress ?? null,
      city: raw.city ?? null,
      state: raw.state ?? null,
      zipCode: raw.zipCode ?? null,
    };
  } catch {
    return { streetAddress: null, city: null, state: null, zipCode: null };
  }
}

function computeConfidence(p: PassportExtraction, a: AddressExtraction): number {
  const fields = [p.fullName, p.dateOfBirth, p.nationality, p.passportNumber, p.passportExpiration, a.streetAddress, a.city, a.state, a.zipCode];
  const filled = fields.filter((v) => v !== null && v !== "").length;
  return Math.round((filled / fields.length) * 100);
}

export async function extractDocuments(
  passportBuffer: Buffer | null,
  passportMime: string | null,
  addressBuffer: Buffer | null,
  addressMime: string | null,
): Promise<ExtractionResult> {
  const emptyPassport: PassportExtraction = { fullName: null, dateOfBirth: null, nationality: null, passportNumber: null, passportExpiration: null };
  const emptyAddress: AddressExtraction = { streetAddress: null, city: null, state: null, zipCode: null };

  const [passport, address] = await Promise.all([
    passportBuffer && passportMime
      ? extractPassport(passportBuffer, passportMime)
      : Promise.resolve(emptyPassport),
    addressBuffer && addressMime
      ? extractAddress(addressBuffer, addressMime)
      : Promise.resolve(emptyAddress),
  ]);

  return { passport, address, confidence: computeConfidence(passport, address) };
}
