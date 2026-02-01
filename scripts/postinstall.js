// Postinstall script to ensure Prisma client is generated and accessible
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

try {
  // Generate Prisma client
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // @prisma/client expects .prisma/client/default to exist
  // Create it if it doesn't exist
  const prismaClientPath = path.join(process.cwd(), 'node_modules/.prisma/client')
  const defaultPath = path.join(prismaClientPath, 'default')
  
  if (!fs.existsSync(defaultPath)) {
    fs.mkdirSync(defaultPath, { recursive: true })
  }
  
  // Copy all necessary files to default directory
  const filesToCopy = ['client.ts', 'enums.ts', 'browser.ts', 'models.ts', 'commonInputTypes.ts']
  filesToCopy.forEach(file => {
    const srcPath = path.join(prismaClientPath, file)
    const destPath = path.join(defaultPath, file)
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
    }
  })
  
  // Copy directories
  const dirsToCopy = ['internal', 'models']
  dirsToCopy.forEach(dir => {
    const srcDir = path.join(prismaClientPath, dir)
    const destDir = path.join(defaultPath, dir)
    if (fs.existsSync(srcDir)) {
      if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true })
      }
      fs.cpSync(srcDir, destDir, { recursive: true })
    }
  })
  
  // Create a symlink from default to parent directory
  // This makes default/ point to the same files as the parent
  // Remove existing default if it's a directory
  if (fs.existsSync(defaultPath)) {
    const stat = fs.statSync(defaultPath)
    if (stat.isDirectory()) {
      fs.rmSync(defaultPath, { recursive: true, force: true })
    } else if (stat.isSymbolicLink()) {
      fs.unlinkSync(defaultPath)
    }
  }
  
  // Create symlink: default -> .. (parent directory)
  // This makes .prisma/client/default/client.ts resolve to .prisma/client/client.ts
  fs.symlinkSync('..', defaultPath, 'dir')
  
  console.log('✅ Prisma client generated and default directory symlinked to parent')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
