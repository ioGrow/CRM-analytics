var client = new Keen({
    projectId: "53c4747373f4bb3e45000000",
    writeKey: "0d09accca199a1651359f56c696e9f1e15d2639b084cfb2c9b215b01dd7f7bd204c478f213b1c4edf7c811cb8bbe0cd44f0239da76f26907134e8441ed90625c32a114082ba5aed93d4d43859aa46580c3e1804749cf0eada9f64d08bda9ebdd680c105dec63edd6d17644d08874005f",
    readKey: "cdd7fce6e97a4e1ef2d69ec3eff1c04647cd75865b5d0eb8f2e2693dd256990e2bfffc10726d5264e4be3a0f8041bb562b3dccbfeed1050496e95c6d0612e6b0af99cb0355e758e5b00e85ba054c955245440c65e189ab314528fb71c15964ea651f359f0cdff3c704d00fe9d3bb9ac0"
  });

var AddEvent = function(email,action){

	var event = {
	  email: email, 
	  action:action,
	  keen: {
	    timestamp: new Date().toISOString()
	  }
	};

	client.addEvent("events",event)
}
