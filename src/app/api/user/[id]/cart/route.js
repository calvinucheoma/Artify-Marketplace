import User from '@/models/User';
import { connectToDatabase } from '@/mongodb/database';

export const POST = async (req, { params }) => {
  // any route under the 'user' and '[id]' folder would have access to the 'params'

  try {
    const { cart } = await req.json();

    await connectToDatabase();

    const userId = params.id;

    const user = await User.findById(userId);

    if (!user) {
      return new Response('UserId does not exist', { status: 404 });
    }

    user.cart = cart;

    await user.save();

    return new Response(JSON.stringify(user.cart), { status: 200 });
  } catch (error) {
    console.log(error.message);
    return new Response('Failed to add work to cart', { status: 500 });
  }
};

/*
  •JSON.stringify is used to convert JavaScript objects into a string for transmission.
  •JSON.parse is used to convert a JSON string back into a JavaScript object.
  •The fetch API automatically parses the response body into a JavaScript object when the Content-Type header is set to application/json.

  •JSON.stringify is used to convert JavaScript objects into a string representation so that they can be 
  transmitted over the network or stored in a file. When sending data from the client to the server, 
  it's common to use JSON.stringify to convert the data into a format that can be easily processed by the server.

  •When the server responds to the client, it often sends data back in JSON format as well. 
   However, the fetch API automatically converts the response body into a JavaScript object if the Content-Type 
   header of the response is set to application/json. Therefore, when you access the data received from the server,
   it's already parsed into a JavaScript object, and you don't need to manually parse it using JSON.parse.

  • When sending data to a server, this data needs to be converted into a string format using JSON.stringify 
    before being sent over the network. On the server side, the server receives this string representation of the 
    data, and then it might parse it back into a JavaScript object using JSON.parse to work with it more easily.

    //   JSON.stringify() EXAMPLE    //

    • This method is used to convert JavaScript objects into a JSON string. 
      It takes an object as input and returns a JSON-formatted string representing that object. 
      This is useful when you want to send data to a server or store it in a file, 
      as JSON is a common data interchange format. For example:

       const obj = { name: 'John', age: 30 };
       const jsonStr = JSON.stringify(obj);
       console.log(jsonStr); // Output: {"name":"John","age":30}

    //  JSON.parse() EXAMPLE       //

      • This method is used to parse a JSON string and convert it into a JavaScript object. 
        It takes a JSON-formatted string as input and returns a JavaScript object representing that data. 
        This is useful when you receive JSON data from a server or read it from a file and need to work with it as
        JavaScript objects. For example:

         const jsonStr = '{"name":"John","age":30}';
         const obj = JSON.parse(jsonStr);
         console.log(obj); // Output: { name: 'John', age: 30 }
*/
