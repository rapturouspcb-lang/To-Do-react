export const locations = [
  { country: 'Pakistan', cities: [
    { name: 'Karachi', timezone: 'Asia/Karachi', lat: 24.8607, lng: 67.0011 },
    { name: 'Lahore', timezone: 'Asia/Karachi', lat: 31.5497, lng: 74.3436 },
    { name: 'Islamabad', timezone: 'Asia/Karachi', lat: 33.6844, lng: 73.0479 },
    { name: 'Rawalpindi', timezone: 'Asia/Karachi', lat: 33.5651, lng: 73.0169 },
    { name: 'Faisalabad', timezone: 'Asia/Karachi', lat: 31.4481, lng: 73.0724 },
    { name: 'Peshawar', timezone: 'Asia/Karachi', lat: 34.0151, lng: 71.5785 },
    { name: 'Quetta', timezone: 'Asia/Karachi', lat: 30.1798, lng: 66.9750 }
  ]},
  { country: 'India', cities: [
    { name: 'New Delhi', timezone: 'Asia/Kolkata', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', timezone: 'Asia/Kolkata', lat: 12.9716, lng: 77.5946 },
    { name: 'Kolkata', timezone: 'Asia/Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Chennai', timezone: 'Asia/Kolkata', lat: 13.0827, lng: 80.2707 }
  ]},
  { country: 'Bangladesh', cities: [
    { name: 'Dhaka', timezone: 'Asia/Dhaka', lat: 23.8103, lng: 90.4125 },
    { name: 'Chattogram', timezone: 'Asia/Dhaka', lat: 22.3569, lng: 91.7832 }
  ]},
  { country: 'Saudi Arabia', cities: [
    { name: 'Riyadh', timezone: 'Asia/Riyadh', lat: 24.7136, lng: 46.6753 },
    { name: 'Mecca', timezone: 'Asia/Riyadh', lat: 21.4225, lng: 39.8262 },
    { name: 'Medina', timezone: 'Asia/Riyadh', lat: 24.4686, lng: 39.6112 },
    { name: 'Jeddah', timezone: 'Asia/Riyadh', lat: 21.4858, lng: 39.1925 }
  ]},
  { country: 'UAE', cities: [
    { name: 'Dubai', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Abu Dhabi', timezone: 'Asia/Dubai', lat: 24.4539, lng: 54.3773 },
    { name: 'Sharjah', timezone: 'Asia/Dubai', lat: 25.3463, lng: 55.4209 }
  ]},
  { country: 'USA', cities: [
    { name: 'New York', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', timezone: 'America/Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', timezone: 'America/Chicago', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', timezone: 'America/Phoenix', lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia', timezone: 'America/New_York', lat: 39.9526, lng: -75.1652 }
  ]},
  { country: 'United Kingdom', cities: [
    { name: 'London', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
    { name: 'Manchester', timezone: 'Europe/London', lat: 53.4808, lng: -2.2426 },
    { name: 'Birmingham', timezone: 'Europe/London', lat: 52.4862, lng: -1.8904 }
  ]},
  { country: 'France', cities: [
    { name: 'Paris', timezone: 'Europe/Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Lyon', timezone: 'Europe/Paris', lat: 45.7640, lng: 4.8357 },
    { name: 'Marseille', timezone: 'Europe/Paris', lat: 43.2965, lng: 5.3698 }
  ]},
  { country: 'Australia', cities: [
    { name: 'Sydney', timezone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', timezone: 'Australia/Melbourne', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane', timezone: 'Australia/Brisbane', lat: -27.4698, lng: 153.0251 }
  ]},
  { country: 'Japan', cities: [
    { name: 'Tokyo', timezone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Osaka', timezone: 'Asia/Tokyo', lat: 34.6937, lng: 135.5023 }
  ]},
  { country: 'Singapore', cities: [
    { name: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198 }
  ]},
  { country: 'Germany', cities: [
    { name: 'Berlin', timezone: 'Europe/Berlin', lat: 52.5200, lng: 13.4050 },
    { name: 'Munich', timezone: 'Europe/Berlin', lat: 48.1351, lng: 11.5820 }
  ]},
  { country: 'Canada', cities: [
    { name: 'Toronto', timezone: 'America/Toronto', lat: 43.6532, lng: -79.3832 },
    { name: 'Vancouver', timezone: 'America/Vancouver', lat: 49.2827, lng: -123.1207 }
  ]}
]

export const getTimezoneByLocation = (country, city) => {
  const countryData = locations.find(loc => loc.country === country)
  if (countryData) {
    const cityData = countryData.cities.find(c => c.name === city)
    return cityData ? cityData.timezone : null
  }
  return null
}

export const getCitiesByCountry = (country) => {
  const countryData = locations.find(loc => loc.country === country)
  return countryData ? countryData.cities : []
}