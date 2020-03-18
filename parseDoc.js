var fs = require('fs');


fs.readFile(__dirname + '/claims.txt', { encoding: 'utf8' }, function(err, data) {

        // if there is an error reading the file then throw error
        if (err) {
            throw err;
        }
    
        claims = buildHierarchy(data);    
        console.log(JSON.stringify(claims));
        return claims;
    });
  
    function buildHierarchy(data)
    {
        // process raw string and convert it to JSON objects
        var claims = initialClaims(data);
    
        claims.filter( claim => claim.parent_id !== '').forEach(
    
            (claim, index) => {
                    claims.find(function(element){
                    return element.id == claim.parent_id;
                }).dependent.push(claim);
    
            }
        );
    
              return claims.filter( claim => claim.parent_id === '');
    }
    
  
    function initialClaims(data) {
    
        // claims array
        var result = [];
    
        var currentclaim = null;
    
        data.match(/.*/g).forEach(line => {
    
            if (line.match(/[0-9]+[.][ ].*/)) {
    
             
                if (currentclaim) {
                    result.push(currentclaim);
                    currentclaim = null;
                }
                currentclaim = line;
            } else {
                currentclaim += line;
            }
        });
    
        // push to result
        result.push(currentclaim);
    
        // convert it to JSON Object
        return result.map(function(claim) { 
    
            var ids = claim.match(/(^[0-9]+)[.]([a-zA-Z ]+)([0-9]*)/);
            return {id: ids[1], parent_id: ids[3], claim: claim, dependent: []};
        });
    
    }