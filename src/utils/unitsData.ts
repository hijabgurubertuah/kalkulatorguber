// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

export interface UnitCategory {
  id: string;
  name: string;
  defaultFrom: string;
  defaultTo: string;
  units: UnitDefinition[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'panjang',
    name: 'Panjang',
    defaultFrom: 'm',
    defaultTo: 'cm',
    units: [
      { id: 'mm', name: 'Milimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
      { id: 'cm', name: 'Sentimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (b) => b * 100 },
      { id: 'm', name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (b) => b },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'inci', name: 'Inci', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254 },
      { id: 'kaki', name: 'Kaki', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
      { id: 'yard', name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144 },
      { id: 'mil', name: 'Mil', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344 },
      { id: 'mil_laut', name: 'Mil Laut', symbol: 'nmi', toBase: (v) => v * 1852, fromBase: (b) => b / 1852 },
    ],
  },
  {
    id: 'massa',
    name: 'Massa',
    defaultFrom: 'kg',
    defaultTo: 'g',
    units: [
      { id: 'mg', name: 'Miligram', symbol: 'mg', toBase: (v) => v / 1e6, fromBase: (b) => b * 1e6 },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
      { id: 'ons', name: 'Ons (100 g)', symbol: 'ons', toBase: (v) => v * 0.1, fromBase: (b) => b / 0.1 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kuintal', name: 'Kuintal', symbol: 'kw', toBase: (v) => v * 100, fromBase: (b) => b / 100 },
      { id: 'ton', name: 'Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'oz', name: 'Ounce (AS)', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (b) => b / 0.028349523125 },
      { id: 'lb', name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237 },
    ],
  },
  {
    id: 'suhu',
    name: 'Suhu',
    defaultFrom: 'c',
    defaultTo: 'f',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (b) => b },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (b) => (b * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (b) => b + 273.15 },
      { id: 'r', name: 'Reamur', symbol: '°R', toBase: (v) => (v * 5) / 4, fromBase: (b) => (b * 4) / 5 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    defaultFrom: 'l',
    defaultTo: 'ml',
    units: [
      { id: 'ml', name: 'Mililiter', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
      { id: 'l', name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (b) => b },
      { id: 'cm3', name: 'Sentimeter Kubik', symbol: 'cm³', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
      { id: 'm3', name: 'Meter Kubik', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'sdt', name: 'Sendok Teh (5 mL)', symbol: 'sdt', toBase: (v) => (v * 5) / 1000, fromBase: (b) => (b * 1000) / 5 },
      { id: 'sdm', name: 'Sendok Makan (15 mL)', symbol: 'sdm', toBase: (v) => (v * 15) / 1000, fromBase: (b) => (b * 1000) / 15 },
      { id: 'cangkir', name: 'Cangkir (240 mL)', symbol: 'cangkir', toBase: (v) => (v * 240) / 1000, fromBase: (b) => (b * 1000) / 240 },
      { id: 'floz', name: 'Fluid Ounce (AS)', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (b) => b / 0.0295735 },
      { id: 'galon', name: 'Galon AS', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (b) => b / 3.78541 },
    ],
  },
  {
    id: 'luas',
    name: 'Luas',
    defaultFrom: 'm2',
    defaultTo: 'hektare',
    units: [
      { id: 'cm2', name: 'Sentimeter Persegi', symbol: 'cm²', toBase: (v) => v * 0.0001, fromBase: (b) => b * 10000 },
      { id: 'm2', name: 'Meter Persegi', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b },
      { id: 'are', name: 'Are', symbol: 'a', toBase: (v) => v * 100, fromBase: (b) => b / 100 },
      { id: 'hektare', name: 'Hektare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000 },
      { id: 'km2', name: 'Kilometer Persegi', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
      { id: 'in2', name: 'Inci Persegi', symbol: 'in²', toBase: (v) => v * 0.00064516, fromBase: (b) => b / 0.00064516 },
      { id: 'ft2', name: 'Kaki Persegi', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (b) => b / 0.092903 },
      { id: 'acre', name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (b) => b / 4046.86 },
    ],
  },
  {
    id: 'kecepatan',
    name: 'Kecepatan',
    defaultFrom: 'kmh',
    defaultTo: 'ms',
    units: [
      { id: 'ms', name: 'Meter per Detik', symbol: 'm/s', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kmh', name: 'Kilometer per Jam', symbol: 'km/jam', toBase: (v) => v / 3.6, fromBase: (b) => b * 3.6 },
      { id: 'mph', name: 'Mil per Jam', symbol: 'mil/jam', toBase: (v) => v * 0.44704, fromBase: (b) => b / 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (b) => b / 0.514444 },
      { id: 'fts', name: 'Kaki per Detik', symbol: 'ft/s', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
    ],
  },
  {
    id: 'waktu',
    name: 'Waktu',
    defaultFrom: 'jam',
    defaultTo: 'menit',
    units: [
      { id: 'ms', name: 'Milidetik', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
      { id: 's', name: 'Detik', symbol: 's', toBase: (v) => v, fromBase: (b) => b },
      { id: 'min', name: 'Menit', symbol: 'mnt', toBase: (v) => v * 60, fromBase: (b) => b / 60 },
      { id: 'jam', name: 'Jam', symbol: 'jam', toBase: (v) => v * 3600, fromBase: (b) => b / 3600 },
      { id: 'hari', name: 'Hari', symbol: 'hari', toBase: (v) => v * 86400, fromBase: (b) => b / 86400 },
      { id: 'minggu', name: 'Minggu', symbol: 'mgg', toBase: (v) => v * 604800, fromBase: (b) => b / 604800 },
      { id: 'bulan', name: 'Bulan (30,44 hari)', symbol: 'bln', toBase: (v) => v * 30.44 * 86400, fromBase: (b) => b / (30.44 * 86400) },
      { id: 'tahun', name: 'Tahun (365,25 hari)', symbol: 'thn', toBase: (v) => v * 365.25 * 86400, fromBase: (b) => b / (365.25 * 86400) },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    defaultFrom: 'gb',
    defaultTo: 'mb',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', toBase: (v) => v / 8, fromBase: (b) => b * 8 },
      { id: 'byte', name: 'Byte', symbol: 'B', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (b) => b / 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: (v) => v * 1024 ** 2, fromBase: (b) => b / 1024 ** 2 },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: (v) => v * 1024 ** 3, fromBase: (b) => b / 1024 ** 3 },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: (v) => v * 1024 ** 4, fromBase: (b) => b / 1024 ** 4 },
    ],
  },
  {
    id: 'tekanan',
    name: 'Tekanan',
    defaultFrom: 'bar',
    defaultTo: 'kpa',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (b) => b / 100000 },
      { id: 'atm', name: 'Atmosfer', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (b) => b / 101325 },
      { id: 'psi', name: 'PSI', symbol: 'psi', toBase: (v) => v * 6894.757, fromBase: (b) => b / 6894.757 },
      { id: 'mmhg', name: 'Milimeter Merkuri', symbol: 'mmHg', toBase: (v) => v * 133.322, fromBase: (b) => b / 133.322 },
    ],
  },
  {
    id: 'energi',
    name: 'Energi',
    defaultFrom: 'kkal',
    defaultTo: 'kj',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'kal', name: 'Kalori', symbol: 'kal', toBase: (v) => v * 4.184, fromBase: (b) => b / 4.184 },
      { id: 'kkal', name: 'Kilokalori', symbol: 'kkal', toBase: (v) => v * 4184, fromBase: (b) => b / 4184 },
      { id: 'kwh', name: 'Kilowatt-jam', symbol: 'kWh', toBase: (v) => v * 3.6e6, fromBase: (b) => b / 3.6e6 },
      { id: 'btu', name: 'BTU', symbol: 'BTU', toBase: (v) => v * 1055.06, fromBase: (b) => b / 1055.06 },
    ],
  },
  {
    id: 'daya',
    name: 'Daya',
    defaultFrom: 'kw',
    defaultTo: 'hp',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'hp', name: 'Horsepower (hp)', symbol: 'hp', toBase: (v) => v * 745.699872, fromBase: (b) => b / 745.699872 },
      { id: 'pk', name: 'Paardenkracht (PK)', symbol: 'PK', toBase: (v) => v * 735.49875, fromBase: (b) => b / 735.49875 },
    ],
  },
  {
    id: 'sudut',
    name: 'Sudut',
    defaultFrom: 'deg',
    defaultTo: 'rad',
    units: [
      { id: 'deg', name: 'Derajat', symbol: '°', toBase: (v) => (v * Math.PI) / 180, fromBase: (b) => (b * 180) / Math.PI },
      { id: 'rad', name: 'Radian', symbol: 'rad', toBase: (v) => v, fromBase: (b) => b },
      { id: 'grad', name: 'Gradian', symbol: 'grad', toBase: (v) => (v * Math.PI) / 200, fromBase: (b) => (b * 200) / Math.PI },
      { id: 'rev', name: 'Putaran', symbol: 'putaran', toBase: (v) => v * 2 * Math.PI, fromBase: (b) => b / (2 * Math.PI) },
    ],
  },
];

export function convertUnits(
  val: number,
  fromUnitId: string,
  toUnitId: string,
  categoryId: string
): number {
  if (isNaN(val)) return 0;
  const cat = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return val;

  const fromUnit = cat.units.find((u) => u.id === fromUnitId);
  const toUnit = cat.units.find((u) => u.id === toUnitId);
  if (!fromUnit || !toUnit) return val;

  const baseVal = fromUnit.toBase(val);
  return toUnit.fromBase(baseVal);
}
