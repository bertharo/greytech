// Postinstall script to ensure Prisma client is properly set up
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

try {
  // Generate Prisma client
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Ensure .prisma/client/default exists for @prisma/client compatibility
  const prismaClientPath = path.join(process.cwd(), 'node_modules/.prisma/client')
  const defaultPath = path.join(prismaClientPath, 'default')
  
  if (!fs.existsSync(defaultPath)) {
    console.log('Creating .prisma/client/default directory...')
    fs.mkdirSync(defaultPath, { recursive: true })
    
    // Copy all files from .prisma/client to .prisma/client/default
    const files = fs.readdirSync(prismaClientPath)
    files.forEach(file => {
      if (file !== 'default') {
        const srcPath = path.join(prismaClientPath, file)
        const destPath = path.join(defaultPath, file)
        const stat = fs.statSync(srcPath)
        
        if (stat.isDirectory()) {
          fs.cpSync(srcPath, destPath, { recursive: true })
        } else {
          fs.copyFileSync(srcPath, destPath)
        }
      }
    })
    
    console.log('✅ Prisma client setup complete')
  }
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
