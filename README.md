# eic-modern

A modern ES6 / TypeScript library for [EIC code](https://en.wikipedia.org/wiki/Energy_Identification_Code) validation and generation.

The core library is based on [this](https://github.com/E-Group-ICT/EICjs/blob/master/eic.js) repository (refactored to ES6, TS and updated the LIO list)

Try out: [EIC code validator and generator demo page](http://localhost:5174)

## Installation

```bash
npm install eic-modern
```

## API Reference

### Basic Validation

#### `isValid(str: string): boolean`

Check if a given EIC string is valid. Returns true if the string is exactly 16 characters long, in the correct format, and the check character is correct.

```typescript
import { isValid } from 'eic-modern';

isValid('10x1001a1001a50z'); // true
isValid('10x1001a1001a50x'); // false (wrong check character)
isValid('ASD'); // false (too short)
```

#### `mayBeEIC(str: string): boolean`

Quick check to see if a string looks like an EIC code. Returns true if the string has the correct length and format, but doesn't verify the check character.

```typescript
import { mayBeEIC } from 'eic-modern';

mayBeEIC('10x1001a1001a50z'); // true
mayBeEIC('10x1001a1001a50x'); // true (format is correct, even if check char is wrong)
mayBeEIC('ASD'); // false (too short)
mayBeEIC('10X1001A1001A50Z'); // true (case insensitive)
```

### Detailed Examination

#### `examine(str: string): ExamineResult`

Comprehensive examination of an EIC string. Returns detailed information about validity, errors, warnings, issuer, and type.

```typescript
import { examine } from 'eic-modern';

const result = examine('10x1001a1001a50z');
console.log(result);
// {
//   isValid: true,
//   errors: [],
//   warnings: [],
//   issuer: { name: 'ENTSO-E', country: 'EU' },
//   type: 'PARTY'
// }

const invalid = examine('10x1001a1001a50x');
console.log(invalid);
// {
//   isValid: false,
//   errors: [{ errorMessage: 'CHECKCHAR_MISMATCH', errorParams: ['z', 'x'] }],
//   warnings: [],
//   issuer: { name: 'ENTSO-E', country: 'EU' },
//   type: 'PARTY'
// }
```

### Information Extraction

#### `getType(str: string): string | undefined`

Get the type of object represented by a valid EIC code. Possible types: "PARTY", "AREA", "MEASUREMENT_POINT", "LOCATION", "RESOURCE", "TIE_LINE", "SUBSTATION".

```typescript
import { getType } from 'eic-modern';

getType('10x1001a1001a50z'); // 'PARTY'
getType('10y1001a1001a50x'); // 'AREA'
getType('10z1001a1001a50v'); // 'MEASUREMENT_POINT'
getType('invalid'); // throws Error: 'Malformed EIC code'
```

#### `getIssuer(str: string): { name: string; country: string } | undefined`

Get the issuing organization information for a valid EIC code.

```typescript
import { getIssuer } from 'eic-modern';

getIssuer('10x1001a1001a50z'); // { name: 'ENTSO-E', country: 'EU' }
getIssuer('11x1001a1001a50y'); // { name: 'BDEW', country: 'DE' }
getIssuer('12x1001a1001a50x'); // { name: 'Swissgrid', country: 'CH' }
getIssuer('invalid'); // throws Error: 'Malformed EIC code'
```

### Generation

#### `generateRandomEIC(): string`

Generate a random, valid EIC code. The type and issuer are randomly chosen from available options.

```typescript
import { generateRandomEIC } from 'eic-modern';

const randomEIC = generateRandomEIC();
console.log(randomEIC); // e.g., '45z7k2m9n1p4q8r6'
console.log(isValid(randomEIC)); // true
```

#### `generateEICWithTypeAndIssuer(type: string, issuer: string): string`

Generate a random EIC code with specific type and issuer.

```typescript
import { generateEICWithTypeAndIssuer } from 'eic-modern';

// Generate a PARTY type EIC from ENTSO-E
const eic = generateEICWithTypeAndIssuer('x', '10');
console.log(eic); // e.g., '10x7k2m9n1p4q8r6z'

// Generate an AREA type EIC from BDEW (Germany)
const areaEIC = generateEICWithTypeAndIssuer('y', '11');
console.log(areaEIC); // e.g., '11y3f5h7j9k2l4m8'

// Invalid type or issuer will throw an error
generateEICWithTypeAndIssuer('invalid', '10'); // throws Error: 'Invalid type: invalid'
```

### Utility Functions

#### `calcCheckChar(str: string): string`

Calculate the check character for a 15-character EIC string.

```typescript
import { calcCheckChar } from 'eic-modern';

const checkChar = calcCheckChar('10x1001a1001a50');
console.log(checkChar); // 'z'

// Build a complete EIC
const base = '10x1001a1001a50';
const completeEIC = base + calcCheckChar(base);
console.log(completeEIC); // '10x1001a1001a50z'
```

## Type Definitions

```typescript
interface ExamineResult {
    isValid: boolean;
    errors: Array<{ errorMessage: string; errorParams?: unknown[] }>;
    warnings: Array<{ errorMessage: string; errorParams?: unknown[] }>;
    issuer?: { name: string; country: string };
    type?: string;
}
```

## Error Messages

The `examine()` function can return the following error messages:

- `TOO_SHORT`: String is shorter than 16 characters
- `TOO_LONG`: String is longer than 16 characters
- `INVALID_CHARACTER`: Contains invalid characters (not a-z, 0-9, or -)
- `CHECKCHAR_MISMATCH`: Check character doesn't match calculated value
- `CHECKCHAR_HYPHEN`: Check character is a hyphen (edge case)

## Warning Messages

- `UNKNOWN_TYPE`: Type character not recognized
- `UNKNOWN_ISSUER`: Issuer code not recognized

## Development

This project uses npm workspaces to manage a monorepo structure:

- `packages/core` - The main library
- `packages/demo` - HTML demo showcasing the library

### Getting Started

```bash
# Install dependencies
npm install

# Start development mode (runs both core build and demo)
npm run dev

# Build all packages
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
eic-modern/
├── packages/
│   ├── core/          # Main library package
│   └── demo/          # Demo application
├── package.json       # Root package.json with workspaces
└── tsconfig.json      # Shared TypeScript configuration
```

## License

MIT
