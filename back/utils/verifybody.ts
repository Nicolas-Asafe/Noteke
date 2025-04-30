export class Verify {
    private expectedProperties: string[];
    private expectedValues: Record<string, string>;
  
    constructor(expectedBody: Record<string, string> = {}) {
      this.expectedProperties = Object.keys(expectedBody);
      this.expectedValues = expectedBody;
    }
  
    VerifyIfIsCorrect(body: Record<string, unknown>): [string, boolean] {
      const bodyProperties = Object.keys(body);
  
      if (this.expectedProperties.length !== bodyProperties.length) {
        return ['Credentials incorrect: different number of properties', false];
      }
  
      for (const prop of this.expectedProperties) {
        if (!body.hasOwnProperty(prop)) {
          return [`Property '${prop}' is missing`, false];
        }
  
        if (typeof body[prop] !== 'string') {
          return [`Property '${prop}' must be a string`, false];
        }
      }
  
      return ['Credentials are correct', true];
    }
  
    VerifyIfCredentialsExists(body: unknown): [string, boolean] {
      if (!body || typeof body !== 'object') {
        return ['Credentials missing', false];
      }
      return ['Credentials found', true];
    }
  
    NewBody(body: Record<string, string>): void {
      this.expectedValues = body;
      this.expectedProperties = Object.keys(body);
    }
  }
  