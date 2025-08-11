/**
 * This lib is based on https://github.com/E-Group-ICT/EICjs/blob/master/eic.js
 *
 * Modified to export functions as ES6 module and added TypeScript types.
 */
/**
 *  Does given string look like an EIC code? This function returns true if given string may be an EIC coce:
 *  it has the correct length and format; however, this function does not examine the check character.
 *
 *  @param  {string} str The examined string
 *  @return {boolean} True if the given string looks like an EIC code: has the correct length, format, etc.
 */
export declare function mayBeEIC(str: string): boolean;
/**
 *  Calculates the check character for given string. The string must be 15 characters long (or 16 characters long,
 *  but in that case the 16th character is discarded).
 *
 *  @param  {string} str The examined string. Must be 15 or 16 characters long, and must be a well-formed EIC-string.
 *  @return {character} A single character that is the check character for the given string.
 */
export declare function calcCheckChar(str: string): string;
interface ExamineResult {
    isValid: boolean;
    errors: Array<{
        errorMessage: string;
        errorParams?: unknown[];
    }>;
    warnings: Array<{
        errorMessage: string;
        errorParams?: unknown[];
    }>;
    issuer?: {
        name: string;
        country: string;
    };
    type?: string;
}
/**
 *  Return the type of the object represented by a valid EIC code. The type may be "PARTY", "AREA", "MEASUREMENT_POINT", "LOCATION",
 *  "RESOURCE", "TIE_LINE" or "SUBSTATION". For more information about these, see the
 *  [Reference Manual](https://www.entsoe.eu/fileadmin/user_upload/edi/library/downloads/EIC_Reference_Manual_Release_5.pdf).
 */
export declare function getType(str: string): string | undefined;
export declare function getIssuer(str: string): {
    name: string;
    country: string;
} | undefined;
/**
 *  Examine a string to see if it's a valid EIC code.
 *
 *  This resturns an object containing the possibly lists of errors and warnings concerning the given string, and also the issuer and type, if any.
 */
export declare function examine(str: string): ExamineResult;
/**
 *  Check to see if a given EIC string is valid.
 *
 *  Returns true iff the given string is exactly 16 characters long, it's in the correct format, and the
 *  check character checks out.
 */
export declare function isValid(str: string): boolean;
/**
 * Generate a random EIC code.
 *
 * The generated code will be valid, but it may not correspond to any real-world entity.
 * The type and issuer are randomly chosen from the available options.
 */
export declare function generateRandomEIC(): string;
/**
 * Generate a random EIC code with a specific type and issuer.
 *
 * The generated code will be valid, but it may not correspond to any real-world entity.
 * The type and issuer must be valid according to the EIC specification.
 */
export declare function generateEICWithTypeAndIssuer(type: string, issuer: string): string;
export {};
//# sourceMappingURL=index.d.ts.map