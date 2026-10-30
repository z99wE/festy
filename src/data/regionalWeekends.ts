export interface LongWeekend {
  id: string;
  name: string;
  dates: string;
  daysCount: number;
  season: string;
  theme: string;
  suggestedEvent: string;
  idealFor: string;
}

export interface RegionLongWeekends {
  regionName: string;
  regionCode: string;
  countryCode: string;
  flag: string;
  longWeekends: LongWeekend[];
}

export const REGIONAL_LONG_WEEKENDS: Record<string, RegionLongWeekends> = {
  US: {
    regionName: 'United States',
    regionCode: 'US',
    countryCode: 'US',
    flag: '🇺🇸',
    longWeekends: [
      {
        id: 'memorial-day',
        name: 'Memorial Day Long Weekend',
        dates: 'Late May (Saturday – Monday)',
        daysCount: 3,
        season: 'Late Spring / Kickoff of Summer',
        theme: 'Open-Air Rooftop & BBQ Soirée',
        suggestedEvent: 'Milestone Birthday & Backyard Gala',
        idealFor: '100–250 guests with outdoor seating and craft cocktail stations',
      },
      {
        id: 'fourth-july',
        name: 'Independence Day 4-Day Extended Weekend',
        dates: 'July 3 – July 6 (Thursday – Sunday)',
        daysCount: 4,
        season: 'Mid Summer',
        theme: 'Lakeside Pavilion & Fireworks Gathering',
        suggestedEvent: 'Community Carnival & Family Reunion',
        idealFor: 'Multi-generational feasts with food truck staging',
      },
      {
        id: 'labor-day',
        name: 'Labor Day Long Weekend',
        dates: 'Early September (Saturday – Monday)',
        daysCount: 3,
        season: 'Late Summer Golden Hour',
        theme: 'Sunset Wine Tasting & Acoustic Night',
        suggestedEvent: 'Vow Renewal & Intimate Dinner',
        idealFor: '50–120 guests with warm string lighting',
      },
      {
        id: 'thanksgiving',
        name: 'Thanksgiving 4-Day Holiday Weekend',
        dates: 'Late November (Thursday – Sunday)',
        daysCount: 4,
        season: 'Late Autumn',
        theme: 'Grand Banquet & Heritage Reunion',
        suggestedEvent: 'Alumni Reunion & Family Milestone Feast',
        idealFor: 'Artisanal dining with course-by-course pairings',
      },
    ],
  },
  EU: {
    regionName: 'European Union & UK',
    regionCode: 'EU',
    countryCode: 'GB',
    flag: '🇪🇺',
    longWeekends: [
      {
        id: 'easter-weekend',
        name: 'Easter 4-Day Bank Holiday Weekend',
        dates: 'Good Friday – Easter Monday (4 Days)',
        daysCount: 4,
        season: 'Spring Blossom',
        theme: 'Botanical Garden Gala & High Tea',
        suggestedEvent: 'Spring Wedding & Bridal Shower',
        idealFor: 'Floral installations and acoustic quartet',
      },
      {
        id: 'may-bank-holiday',
        name: 'Early May Bank Holiday Weekend',
        dates: 'First Weekend of May (Saturday – Monday)',
        daysCount: 3,
        season: 'Early Summer',
        theme: 'Open-Air Music & Vineyard Retreat',
        suggestedEvent: 'Executive Offsite & Team Gathering',
        idealFor: 'Private villa rental with local gastronomy',
      },
      {
        id: 'summer-bank-holiday',
        name: 'August Late Summer Long Weekend',
        dates: 'Late August (Saturday – Monday)',
        daysCount: 3,
        season: 'Peak Summer',
        theme: 'Festival Lawn & DJ Sunset Stage',
        suggestedEvent: 'Milestone 30th/40th Birthday Festival',
        idealFor: 'Food truck village and open-air acoustics',
      },
    ],
  },
  IN: {
    regionName: 'India & South Asia',
    regionCode: 'IN',
    countryCode: 'IN',
    flag: '🇮🇳',
    longWeekends: [
      {
        id: 'diwali-weekend',
        name: 'Diwali 5-Day Festive Megablock',
        dates: 'October / November (Dhanteras to Bhai Dooj)',
        daysCount: 5,
        season: 'Autumn Festival of Lights',
        theme: 'Royal Lantern Banquet & Sangeet Night',
        suggestedEvent: 'Grand Festive Gala & Family Reunion',
        idealFor: '300–800 guests, royal lighting grids, traditional sweets',
      },
      {
        id: 'independence-day',
        name: 'Independence Day & Raksha Bandhan Weekend',
        dates: 'Mid August (Friday – Sunday / Monday)',
        daysCount: 3,
        season: 'Monsoon Celebration',
        theme: 'Heritage Cultural Feast & Dance',
        suggestedEvent: 'Alumni Reunion & Cultural Soirée',
        idealFor: 'Live performance stage and multi-cuisine buffet',
      },
      {
        id: 'holi-weekend',
        name: 'Holi Long Weekend Celebration',
        dates: 'March (Friday – Sunday)',
        daysCount: 3,
        season: 'Spring Bloom',
        theme: 'Organic Colors & Daytime Lawn Carnival',
        suggestedEvent: 'Festive Music & Street Food Carnival',
        idealFor: 'Thandai bar, rain dance stage, DJ set',
      },
    ],
  },
  GLOBAL: {
    regionName: 'International',
    regionCode: 'GLOBAL',
    countryCode: 'GLOBAL',
    flag: '🌍',
    longWeekends: [
      {
        id: 'nye-weekend',
        name: 'New Year’s Eve Long Celebration Weekend',
        dates: 'Dec 30 – Jan 2 (3 to 4 Days)',
        daysCount: 4,
        season: 'Winter Festivities',
        theme: 'Black-Tie Midnight Countdown Gala',
        suggestedEvent: 'Global New Year Celebration',
        idealFor: 'Champagne towers, projection mapping, pro audio',
      },
      {
        id: 'lunar-new-year',
        name: 'Lunar New Year 4-Day Celebration Block',
        dates: 'Late January / February',
        daysCount: 4,
        season: 'Spring Festival',
        theme: 'Lantern Parade & Traditional Feast',
        suggestedEvent: 'Heritage Celebration & Banquet',
        idealFor: 'Lion dance staging, family tables, firework displays',
      },
    ],
  },
};
