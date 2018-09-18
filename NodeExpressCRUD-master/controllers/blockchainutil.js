var request = require('request');
var sha = require('sha256');

global.surl="http://172.16.40.170:4000"; 

var blockid=0;
// click on view source icon to copy code.
class Block{
	
constructor(index, data, prevHash){
	this.index = index;
	this.timestamp = Math.floor(Date.now() / 1000);
	this.data = data;
	this.prevHash = prevHash;
	this.hash = this.getHash();
}

getHash(){
	return sha(JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp);
}

}

class BlockChain{
	constructor(){
		this.chain = [];
	}

 addBlock(dataheader){
	//console.log(dataheader);
	let index = this.chain.length; //dataheader.number; 
	let prevHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;  //dataheader.previous_hash;  
	let block = new Block(index, dataheader.data_hash, prevHash);

	this.chain.push(block);
 }

  chainIsValid(){

	for(var i=0;i<this.chain.length;i++){

		if(this.chain[i].hash !== this.chain[i].getHash()) 
			return false;

		if(i > 0 && this.chain[i].prevHash !== this.chain[i-1].hash)
			return false;
	}

	return true;
  }

}

global.blockChainData = new BlockChain();

var blockmethods = {}; 

blockmethods.getMyBlock =  function(req, res){

var requestData = {};
//console.log('parsedata'+JSON.stringify(requestData || null ));
//console.log('checking token '+global.Token);
//console.log('blockid '+blockid);
var data = {
    url: "http://172.16.40.170:4000/channels/mychannel/blocks/"+blockid+"?peer=peer0.org1.example.com",
    json: true,
    headers: {
           'Content-Type': 'application/json',
 	    'Authorization':'Bearer '+ global.Token
    },
    body: JSON.parse(JSON.stringify(requestData || null ))
}
blockid = blockid+1;


request.get(data, function(error, httpResponse, block){
if(!error){
    //console.log('response data'+JSON.stringify(block.header));
    console.log("Block created  sucessfully created");
   //genarate block
  calculateBlockHash(block.header);
  //console.log("currenthash"+currenthash)
}

});
}

function calculateBlockHash(header) {
	global.blockChainData.addBlock(header);
	console.log(JSON.stringify(global.blockChainData, null, 4));
}

/*
var calculateBlockHash = function(header) {
  var asn = require('asn1js');
  let headerAsn = asn.define('headerAsn', function() {
    this.seq().obj(
      this.key('Number').int(),
      this.key('PreviousHash').octstr(),
      this.key('DataHash').octstr()
    );
  });

  let output = headerAsn.encode({
      Number: parseInt(header.number),
      PreviousHash: Buffer.from(header.previous_hash, 'hex'),
      DataHash: Buffer.from(header.data_hash, 'hex')
    }, 'der');
  let hash = sha.sha256(output);
  return hash;

};

*/

module.exports = blockmethods;