package neogonep5

import (
	"github.com/CityOfZion/neo-storm/interop/runtime"
	"github.com/CityOfZion/neo-storm/interop/storage"
	"github.com/CityOfZion/neo-storm/interop/util"
)

var owner = util.FromAddress("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y")
var node = util.FromAddress("AKkkumHbBipZ46UMZJoFynJMXzSRnBvKcs")

// Main function = contract entry
func Main(operation string, args []interface{}) string {

	ctx := storage.GetContext()

	if operation == "update" {
		runtime.Log("create called")
		return updateSubscribersHash(ctx, args)
	}

	if operation == "list" {
		runtime.Log("list called")
		return listSubscribersHash(ctx, args)
	}

	return "SUCCESS_RUN_MAIN"
}

/* Updates the IPFS-hash with list of subscribers for a specific mailing list to reflect the new list of subscribers */
func updateSubscribersHash(ctx storage.Context, args []interface{}) string {
	/*
	if !runtime.CheckWitness(owner) {
		runtime.Log("not the owner.. not updating list")
		return false
	}*/

	listId := args[0].(string)
	subsriberHash := args[1].(string)

	storage.Put(ctx, listId, subsriberHash)
	return "SUCCESS_UPDATE_SUBSCRIBE_HASH"
}

/*retrieve the IPFS hash of a specific list to get list of subscribed users*/
func listSubscribersHash(ctx storage.Context, args []interface{}) string {
	listId := args[0].(string)
	/*
	if !runtime.CheckWitness(owner) {
		return "not the owner.. not getting the subscribers IPFS hash!"
	}
	 */
	var listHash = storage.Get(ctx, listId).(string)
	return listHash
}
