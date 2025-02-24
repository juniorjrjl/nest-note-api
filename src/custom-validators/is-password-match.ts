import { Validate, ValidationOptions } from 'class-validator';
import { IsPasswordsMatchConstraint } from './is-password-match-constraint';

export function IsPasswordsMatch(property: string, validationOptions?: ValidationOptions) {
    return Validate(IsPasswordsMatchConstraint, [property], validationOptions);
}