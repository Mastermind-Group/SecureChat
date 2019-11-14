# Welcome to SecureChat!

## What is SecureChat?

SecureChat is an open source application built on Electron with a Go backend. This application intends to provide messaging where you can add unlimited people to a group chat, built in password management features, and a note/file sharing system. These features are entirely encrypted and secure. We aim to have this application be secure in all scenarios, even if the server was compromised and potentially monitoring all traffic no data would be readable by the attacker.

## How does it work?

After downloading the app you may register an account. When this happens your computer will generate a public and private key. Public keys can be thought of as locks and private keys the only key to unlock that lock. Your computer will send the public key(lock) to the server but keep the private key(key) locked away on your computer. When you create a new messaging channel, your computer will randomly generate a strong password just for this channel. After this it will take all of the users you invited and encrypt this channel password with their public key. This is essentially creating a box for each person and putting the channel password in the box, then locking the box with their lock. The only people who can open this box to see the channel password are the people with the keys. Essentially when you log in you look for all the boxes addressed to you and use your private key to unlock the box and read the channel password. When you send messages to this channel you both encrypt and decrypt messages with the channel password. If you want to read more, look into RSA (which are the public and private keys) and AES (Which is a method that both encrypts and decrypts messages with a password, in this case the channel password)

### "Wait but the code IS sending the private key to the server!!"

At the moment in order to help you login from any computer we are encrypting your private key with your password for your account. So that way when you successfully log in you can just decrypt the private key and use it to get your channel passwords. Currently we have plans to move away from this system because this means you have to trust the server more and we want to minimize the amount of trust you have to give

## Development

### How can I help develop this app?

You may fork this project and make pull requests whenever you want. Please make sure you follow the style guides provided so that our code can be consistent and clean
