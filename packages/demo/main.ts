import './style.css';
import {
    mayBeEIC,
    examine,
    getType,
    getIssuer,
    generateRandomEIC as libGenerateRandomEIC,
    generateEIC,
} from 'eic-modern';

// Make functions available globally for the demo
declare global {
    interface Window {
        generateRandomEIC: () => void;
        generateCustomEIC: () => void;
        validateInputEIC: () => void;
        validateIdentifierInput: () => void;
        testSampleEIC: (eic: string) => void;
        clearInput: () => void;
    }
}

// Utility function to show/hide elements
function showElement(id: string) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('hidden');
    }
}

function hideElement(id: string) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('hidden');
    }
}

function setElementText(id: string, text: string) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function setElementHTML(id: string, html: string) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

// Validation functions
function showError(elementId: string, message: string) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function hideError(elementId: string) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

function setInputValidity(inputId: string, isValid: boolean, message: string = '') {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
        if (isValid) {
            input.setCustomValidity('');
            input.classList.remove('invalid:border-red-500', 'invalid:ring-red-500');
        } else {
            input.setCustomValidity(message);
            input.classList.add('invalid:border-red-500', 'invalid:ring-red-500');
        }
    }
}

// Generate random EIC
window.generateRandomEIC = function () {
    try {
        const eic = libGenerateRandomEIC();
        const type = getType(eic);
        const issuer = getIssuer(eic);

        setElementText('generated-eic', eic);
        setElementText('generated-type', type || 'Unknown');
        setElementText('generated-issuer', issuer ? `${issuer.name} (${issuer.country})` : 'Unknown');

        showElement('generated-result');

        // Scroll to result
        document.getElementById('generated-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        console.error('Error generating EIC:', error);
    }
};

// Validate identifier input as user types
window.validateIdentifierInput = function () {
    const identifierInput = document.getElementById('eic-identifier') as HTMLInputElement;
    const identifier = identifierInput.value.trim();
    
    hideError('identifier-error');
    setInputValidity('eic-identifier', true);
    
    if (!identifier) {
        // Empty is valid (optional field)
        return;
    }
    
    // Check maximum length
    if (identifier.length > 12) {
        const message = `Identifier must be 12 characters or less (currently ${identifier.length})`;
        showError('identifier-error', message);
        setInputValidity('eic-identifier', false, message);
        return;
    }
    
    // Check valid characters
    const validChars = /^[0-9a-z-]+$/i;
    if (!validChars.test(identifier)) {
        const message = 'Identifier can only contain 0-9, a-z, and hyphen (-)';
        showError('identifier-error', message);
        setInputValidity('eic-identifier', false, message);
        return;
    }
};

// Generate custom EIC
window.generateCustomEIC = function () {
    const typeSelect = document.getElementById('eic-type') as HTMLSelectElement;
    const issuerSelect = document.getElementById('eic-issuer') as HTMLSelectElement;
    const identifierInput = document.getElementById('eic-identifier') as HTMLInputElement;

    const type = typeSelect.value || null;
    const issuer = issuerSelect.value || null;
    const identifier = identifierInput.value.trim() || null;

    // Clear any previous error state
    hideError('identifier-error');
    setInputValidity('eic-identifier', true);

    try {
        // Validate custom identifier if provided
        if (identifier) {
            if (identifier.length > 12) {
                const message = `Identifier must be 12 characters or less (currently ${identifier.length})`;
                showError('identifier-error', message);
                setInputValidity('eic-identifier', false, message);
                identifierInput.focus();
                return;
            }

            // Validate characters in custom identifier
            const validChars = /^[0-9a-z-]+$/i;
            if (!validChars.test(identifier)) {
                const message = 'Identifier can only contain 0-9, a-z, and hyphen (-)';
                showError('identifier-error', message);
                setInputValidity('eic-identifier', false, message);
                identifierInput.focus();
                return;
            }
        }

        const eic = generateEIC(type, issuer, identifier);
        const typeInfo = getType(eic);
        const issuerInfo = getIssuer(eic);

        setElementText('generated-eic', eic);
        setElementText('generated-type', typeInfo || 'Unknown');
        setElementText('generated-issuer', issuerInfo ? `${issuerInfo.name} (${issuerInfo.country})` : 'Unknown');

        showElement('generated-result');

        // Scroll to result
        document.getElementById('generated-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        // Show error in console for debugging, but don't alert the user
        console.error('Error generating EIC:', error);
        
        // If it's a validation error, show it near the relevant field
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        if (errorMessage.includes('type') || errorMessage.includes('issuer')) {
            // These would be programming errors, not user input errors
            console.error('EIC generation error:', errorMessage);
        } else {
            // Assume it's an identifier-related error
            showError('identifier-error', errorMessage);
            setInputValidity('eic-identifier', false, errorMessage);
            identifierInput.focus();
        }
    }
};

// Validate input EIC as user types
window.validateInputEIC = function () {
    const input = document.getElementById('eic-input') as HTMLInputElement;
    const eic = input.value.trim();

    if (!eic) {
        hideElement('validation-result');
        return;
    }

    showElement('validation-result');
    hideElement('valid-result');
    hideElement('invalid-result');
    hideElement('format-result');

    // First check if it might be an EIC
    if (!mayBeEIC(eic)) {
        showElement('format-result');
        return;
    }

    // Examine the EIC for detailed validation
    const result = examine(eic);

    if (result.isValid) {
        // Show valid result
        setElementText('valid-type', result.type || 'Unknown');
        setElementText(
            'valid-issuer',
            result.issuer ? `${(result.issuer as any).name} (${(result.issuer as any).country})` : 'Unknown'
        );
        setElementText('valid-check', eic.charAt(15) || 'N/A');
        showElement('valid-result');
    } else {
        // Show invalid result with errors
        let errorsHTML = '';
        if (result.errors.length > 0) {
            errorsHTML = '<div class="font-medium mb-1">Errors:</div>';
            result.errors.forEach((error: any) => {
                let message = '';
                switch (error.errorMessage) {
                    case 'TOO_SHORT':
                        message = 'EIC code is too short (must be 16 characters)';
                        break;
                    case 'TOO_LONG':
                        message = 'EIC code is too long (must be 16 characters)';
                        break;
                    case 'INVALID_CHARACTER':
                        const [pos, char] = error.errorParams || [];
                        message = `Invalid character '${char}' at position ${pos}`;
                        break;
                    case 'CHECKCHAR_MISMATCH':
                        const [expected, actual] = error.errorParams || [];
                        message = `Check character mismatch. Expected '${expected}', got '${actual}'`;
                        break;
                    case 'CHECKCHAR_HYPHEN':
                        message = 'Check character cannot be a hyphen';
                        break;
                    default:
                        message = error.errorMessage;
                }
                errorsHTML += `<div>• ${message}</div>`;
            });
        }

        let warningsHTML = '';
        if (result.warnings.length > 0) {
            warningsHTML = '<div class="font-medium mb-1 mt-2">Warnings:</div>';
            result.warnings.forEach((warning: any) => {
                let message = '';
                switch (warning.errorMessage) {
                    case 'UNKNOWN_TYPE':
                        const [unknownType] = warning.errorParams || [];
                        message = `Unknown type code '${unknownType}'`;
                        break;
                    case 'UNKNOWN_ISSUER':
                        const [unknownIssuer] = warning.errorParams || [];
                        message = `Unknown issuer code '${unknownIssuer}'`;
                        break;
                    default:
                        message = warning.errorMessage;
                }
                warningsHTML += `<div>• ${message}</div>`;
            });
        }

        setElementHTML('error-list', errorsHTML);
        setElementHTML('warning-list', warningsHTML);
        showElement('invalid-result');
    }
};

// Test with sample EIC
window.testSampleEIC = function (eic: string) {
    const input = document.getElementById('eic-input') as HTMLInputElement;
    input.value = eic;
    window.validateInputEIC();
};

// Clear input
window.clearInput = function () {
    const input = document.getElementById('eic-input') as HTMLInputElement;
    input.value = '';
    hideElement('validation-result');
};

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('EIC Modern Demo loaded!');
});
