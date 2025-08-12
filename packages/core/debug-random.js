import('./dist/index.js').then(eic => {
  console.log('Testing 20 random EIC codes:');
  for (let i = 0; i < 20; i++) {
    const code = eic.generateRandomEIC();
    const valid = eic.isValid(code);
    console.log(`${i+1}: ${code} -> valid: ${valid}`);
    if (!valid) {
      const result = eic.examine(code);
      console.log('   Errors:', result.errors);
      console.log('   Warnings:', result.warnings);
    }
  }
});
