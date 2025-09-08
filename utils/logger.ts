// utils/logger.ts

const log = (...args: any[]) => {
  const blue = '\x1b[34m'; // ANSI blue
  const reset = '\x1b[0m';

  args.forEach((arg) => {
    let output: string;

    if (typeof arg === 'object') {
      // Pretty JSON with 2-space indentation
      output = JSON.stringify(arg, null, 2);
    } else {
      output = String(arg);
    }

    // Split into multiple lines if too long (80 chars per line)
    const maxLength = 80;
    if (output.length > maxLength) {
      const regex = new RegExp(`.{1,${maxLength}}`, 'g');
      const chunks = output.match(regex) || [];
      chunks.forEach((chunk) => console.log(`${blue}${chunk}${reset}`));
    } else {
      console.log(`${blue}${output}${reset}`);
    }
  });
};

export default log;
