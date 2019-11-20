# Welcome to SecureChat!

## What is SecureChat?

SecureChat is an open source application built on Electron with a Go backend. This application intends to provide messaging where you can add unlimited people to a group chat, built in password management features, and a note/file sharing system. These features are entirely encrypted and secure. We aim to have this application be secure in all scenarios, even if the server was compromised and potentially monitoring all traffic no data would be readable by the attacker.

## How does it work?

After downloading the app you may register an account. When this happens your computer will generate a public and private key. Public keys can be thought of as locks and private keys the only key to unlock that lock. Your computer will send the public key(lock) to the server but keep the private key(key) locked away on your computer. When you create a new messaging channel, your computer will randomly generate a strong password just for this channel. After this it will take all of the users you invited and encrypt this channel password with their public key. This is essentially creating a box for each person and putting the channel password in the box, then locking the box with their lock. Essentially when you log in you look for all the boxes addressed to you and use your private key to unlock the box and read the channel password. When you send messages to this channel you both encrypt and decrypt messages with the channel password. If you want to read more, look into RSA (which are the public and private keys) and AES (Which is a method that both encrypts and decrypts messages with a password, in this case the channel password)

### "Wait but the code IS sending the private key to the server!!"

Not really. We were sending the private key to the server in an earlier build and to be fair it was encrypted with the user's password. Now the private keys only exist on your computer. If you want to login from a different device, you must export your key from your account and then import the key after logging in on the new device. Currently you may only do this by getting the file onto your computer somehow but in a future release you will be able to do so over a network.

## Development

### How can I help develop this app?

You may fork this project and make pull requests whenever you want. Please make sure you follow the style guides provided so that our code can be consistent and clean

## To start

1. git clone https://github.com/Mastermind-Group/SecureChat.git
2. cd into the new folder
3. yarn develop

## To build

* Windows: yarn pack:win
* MacOS:   yarn pack:mac
* Linux:   yarn pack:linux
