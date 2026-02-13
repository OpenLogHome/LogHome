$env:NVM_HOME="D:\LogHome\nvm"
$env:NVM_SYMLINK="D:\LogHome\nodejs"
$env:PATH="D:\LogHome\nodejs;"+$env:PATH
nvm ls
nvm use 14.18.0
node -v
npm -v