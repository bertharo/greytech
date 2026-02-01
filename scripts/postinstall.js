// Postinstall script to ensure Prisma client is generated
const { execSync } = require('child_process')

try {
  // Generate Prisma client - that's it!
  // Prisma will generate to the default location that @prisma/client expects
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated successfully')
} catch (error) {
  console.error('Error generating Prisma client:', error)
  process.exit(1)
}
