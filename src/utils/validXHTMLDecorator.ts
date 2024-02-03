import { ValidationOptions, registerDecorator } from 'class-validator';

import config from '../../config';
import * as htmlLint from 'html5-lint';

type message = {
  type: string;
};

const validateHTMLNode = async (content: string, allowedTags: string[]) => {
  return new Promise((resolve, reject) => {
    htmlLint(content, (err, results) => {
      const errors = (results.messages as message[]).filter(
        (message) => message.type === 'error',
      ).length;

      console.log('errors', errors);

      if (err) reject("Can't validate HTML.");
      else if (errors > 0) reject('HTML is not valid.');
      else resolve(results);
    });
  });
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
          const fullDocument = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <title>Page Title</title>
          </head>
          <body>
          ${value}
          </body>
          </html>
            `;
          return validateHTMLNode(fullDocument, config.xhtml.validTags)
            .then(() => true)
            .catch(() => false);
        },
      },
    });
  };
}
