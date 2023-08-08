// Returning Error Message
export function validateUserName(userName: string) {
    if (userName.length < 6 || userName.length > 44) {
        return 'Username length should be not less than 6 chars and not more than 44 chars.';
    }
    return null;
}

// Returning Error Message
export function validateFirstName(firstName: string) {
    if (firstName.length < 6 || firstName.length > 44) {
        return 'First name length should be not less than 6 chars and not more than 44 chars.';
    }
    return null;
}

// Returning Error Message
export function validateLastName(lastName: string) {
    if (lastName.length > 55) {
        return 'Last name length should be not more than 55 chars.';
    }
    return null;
}
