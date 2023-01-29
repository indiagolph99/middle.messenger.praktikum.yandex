import { FormItem } from '$components';

export interface ValidationRule {
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  required?: boolean;
}

export default class Validator {
  private readonly rules: Record<string, ValidationRule[]>;

  private refs: Record<string, FormItem>;

  private validators: Record<string, unknown>;

  constructor(
    rules: Record<string, ValidationRule[]>,
    refs: Record<string, FormItem>,
  ) {
    this.rules = rules;
    this.refs = refs;
    this.validators = {};

    Object.keys(rules).forEach((name) => {
      refs[name].setProps({
        events: {
          focusout: (event: FocusEvent) => {
            const target = event.target as HTMLInputElement;
            refs[name].setError(this.validateRef(name, target.value));
          },
          focusin: () => refs[name].setError(''),
        },
      });
    });
  }

  validateRef(name: string, value: string): string {
    const rule = this.rules[name];
    const errors: string[] = [];
    rule.forEach((subrule) => {
      if (subrule.required !== undefined && value === '') {
        errors.push('Field is required');
      }
      if (subrule.min && value.length < subrule.min) {
        errors.push(`Cannot be shorter than ${subrule.min} symbols`);
      }
      if (subrule.max && value.length > subrule.max) {
        errors.push(`Cannot be longer than ${subrule.max} symbols`);
      }
      if (subrule.pattern && !subrule.pattern.test(value)) {
        errors.push(subrule.message || 'Wrong format');
      }
      errors.push('');
    });
    return errors.find((err) => err.length > 1) || '';
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData.entries());

    const errors: string[] = [];
    Object.keys(this.rules).forEach((name) => {
      const err = this.validateRef(name, formDataObj[name] as string);
      this.refs[name].setError(err);
      errors.push(err);
    });

    return errors.every((err) => err.length === 0);
  }
}
