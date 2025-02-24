import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordsMatch', async: false })
export class IsPasswordsMatchConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: any, args: ValidationArguments): boolean {
        const [relatedPropertyName] = args.constraints;
        const password = (args.object as any)[relatedPropertyName];
        return password === confirmPassword;
    }

    defaultMessage(args: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;
        return `Os campos "${relatedPropertyName}" e "${args.property}" devem ser iguais.`;
    }
}