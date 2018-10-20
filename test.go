package neogonep5

import (
	"github.com/CityOfZion/neo-storm/interop/runtime"
	"github.com/CityOfZion/neo-storm/interop/storage"
)

// Main function = contract entry
func Main_(operation string, args []interface{}) interface{} {

	ctx := storage.GetContext()

	if operation == "link" {
		runtime.Log("linking new fingerprint")
		return link(ctx, args)
	}
	if operation == "verify" {
		runtime.Log("verifying new fingerprint")
		return verify(ctx, args)
	}

	return "main_ended"
}

func link(ctx storage.Context, args []interface{}) string {
	addr := args[0].([]byte)
	fingerprintHash := args[1].(string)

	if !runtime.CheckWitness(addr) {
		runtime.Log("addr is not owned by invoker")
		return "njet"
	}

	storage.Put(ctx, addr, fingerprintHash)
	return "fingerprint linked"
}

func verify(ctx storage.Context, args []interface{}) string {
	addr := args[0].([]byte)
	fingerprintHash := args[1].(string)

	if !runtime.CheckWitness(addr) {
		runtime.Log("addr is not owned by invoker")
		return "njet"
	}

	validFingerPrint := storage.Get(ctx, addr)

	if fingerprintHash == validFingerPrint {
		return "klopt"
	} else {
		return "verkeerde fingerprint voor addr"
	}
}
