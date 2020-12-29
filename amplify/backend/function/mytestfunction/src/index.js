

exports.handler = async (event) => {
    if (event.requestContext.authorizer) {
        console.log('claims: ', event.requestContext.authorizer.claims)
    }

    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: JSON.stringify(event),
    };
    return response;
};
