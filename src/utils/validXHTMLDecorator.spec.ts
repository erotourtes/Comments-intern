import { validate } from 'class-validator';
import { IsValidXHTML } from './validXHTMLDecorator';

class XHTML {
  @IsValidXHTML()
  content: string;
}

describe('XHTML class-validator decorator', () => {
  let xhtml: XHTML;
  beforeEach(() => {
    xhtml = new XHTML();
  });

  it('should not throw', async () => {
    xhtml.content = 'Valid XHTML <code>hello</code>';
    await validate(xhtml).then((errors) => {
      expect(errors.length).toBe(0);
    });
  });

  it('should throw', async () => {
    xhtml.content = 'Hel <script>alert("hello")</script> lo';
    await validate(xhtml).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });

  it('should throw', async () => {
    xhtml.content = `<a>Link<a>`;
    await validate(xhtml).then((errors) => {
      expect(errors.length).toBe(1);
    });
  });
});
