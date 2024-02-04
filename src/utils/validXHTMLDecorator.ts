import { ValidationOptions, registerDecorator } from 'class-validator';
import config from '../../config';

const exctractNameFromTag = (tag: string): string => {
  let name = '';
  for (let i = 1; i < tag.length - 1; i++) {
    if (tag[i] === ' ') break;
    name += tag[i];
  }

  return name;
};

// TODO: add validation for attributes
const isValid = (html: string, allowedTags: string[] = []): boolean => {
  const tags = html.match(/<[^>]*>/g);
  const tagNames: string[] = tags?.map(exctractNameFromTag) || [];
  const stack: string[] = [];

  for (const tag of tagNames) {
    const isOpenningTag = tag[0] !== '/';
    const tagName = !isOpenningTag ? tag.slice(1) : tag;

    if (!allowedTags.includes(tagName)) return false;

    if (isOpenningTag) {
      stack.push(tagName);
    } else {
      const lastTag = stack.pop();
      if (lastTag !== tagName) {
        return false;
      }
    }
  }

  return stack.length === 0;
};

export function IsValidXHTML(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isValid(value, config.xhtml.validTags);
        },
      },
    });
  };
}
