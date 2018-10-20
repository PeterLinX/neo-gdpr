
#1 get into the private net docker container
docker exec -ti neo-privatenet /bin/bash
neopy
open wallet neo-privnet.wallet
contract search g2

#2 get the current hash pointing to IPFS
testinvoke 0x2cd1380a87107b8bc3731871f7ea3318a167d06d list ["newsletter_1"]
#	-->returns 76616c75655f6e65775f313233

#3 convert hex to string
echo 76616c75655f6e65775f313233 | xxd -r -p && echo 
#	-->returns value_new_123

#4 lookup this hash on IPFS to get the hashes of the encrypted email addresses
# --> returns the encrypted hashes for the email addresses. do a lookup in the database & send email




#### SCENARIO 2 ####
#---> user wants to be removed

#1 delete the record from the database

#2 create a new IPFS record with new hashes

#3 store the IPFS hash on the blockchain as the latest version
testinvoke 0x2cd1380a87107b8bc3731871f7ea3318a167d06d update ["newsletter_1","new_hash"]