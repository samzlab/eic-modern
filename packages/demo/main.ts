import './style.css';
import {
    mayBeEIC,
    examine,
    getType,
    getIssuer,
    generateRandomEIC as libGenerateRandomEIC,
    generateEICWithTypeAndIssuer,
} from 'eic-modern';

// Make functions available globally for the demo
declare global {
    interface Window {
        generateRandomEIC: () => void;
        generateCustomEIC: () => void;
        validateInputEIC: () => void;
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

// Generate custom EIC
window.generateCustomEIC = function () {
    const typeSelect = document.getElementById('eic-type') as HTMLSelectElement;
    const issuerSelect = document.getElementById('eic-issuer') as HTMLSelectElement;

    const type = typeSelect.value;
    const issuer = issuerSelect.value;

    if (!type || !issuer) {
        alert('Please select both type and issuer');
        return;
    }

    try {
        const eic = generateEICWithTypeAndIssuer(type, issuer);
        const typeInfo = getType(eic);
        const issuerInfo = getIssuer(eic);

        setElementText('generated-eic', eic);
        setElementText('generated-type', typeInfo || 'Unknown');
        setElementText('generated-issuer', issuerInfo ? `${issuerInfo.name} (${issuerInfo.country})` : 'Unknown');

        showElement('generated-result');

        // Scroll to result
        document.getElementById('generated-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        alert(`Error generating EIC: ${error}`);
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
