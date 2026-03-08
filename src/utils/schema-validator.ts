import Ajv from 'ajv';

// Create one AJV instance and reuse it
const ajv = new Ajv();

export class SchemaValidator {

    static validate(data: unknown, schema: object): void {
        // Compile the schema into a validation function
        const validate = ajv.compile(schema);

        // Run validation
        const valid = validate(data);

        if (!valid) {
            // Format the errors into a readable message
            const errors = validate.errors
                ?.map(err => `  - ${err.instancePath} ${err.message}`)
                .join('\n');

            throw new Error(`Schema validation failed:\n${errors}`);
        }
    }

}