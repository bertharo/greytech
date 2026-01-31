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
  
  // Always ensure default directory exists and is populated
  if (!fs.existsSync(defaultPath)) {
    fs.mkdirSync(defaultPath, { recursive: true })
  }
  
  // Copy all files from .prisma/client to .prisma/client/default
  // This ensures @prisma/client can find the generated client
  const files = fs.readdirSync(prismaClientPath)
  files.forEach(file => {
    if (file !== 'default' && !file.startsWith('.')) {
      const srcPath = path.join(prismaClientPath, file)
      const destPath = path.join(defaultPath, file)
      
      try {
        const stat = fs.statSync(srcPath)
        
        if (stat.isDirectory()) {
          // Use recursive copy for directories
          if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true, force: true })
          }
          fs.cpSync(srcPath, destPath, { recursive: true })
        } else {
          // Copy file
          fs.copyFileSync(srcPath, destPath)
        }
      } catch (err) {
        // Ignore errors for files that might already exist
        console.warn(`Warning: Could not copy ${file}:`, err.message)
      }
    }
  })
  
  console.log('✅ Prisma client setup complete')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
