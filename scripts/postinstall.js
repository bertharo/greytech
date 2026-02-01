// Postinstall script for Prisma 6 - just generate the client
const { execSync } = require('child_process')

try {
  // Generate Prisma client - Prisma 6 doesn't need custom setup
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated successfully')
} catch (error) {
  console.error('Error generating Prisma client:', error)
  process.exit(1)
}
