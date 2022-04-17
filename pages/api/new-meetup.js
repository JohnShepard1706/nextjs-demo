import { MongoClient } from "mongodb";

// The name of this file should follow the name of the page
// api/new-meetup
// If a request is sent to this url, it triggers the function below

const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body;

    // has this data vv
    // const { title, image, address, description } = data;

    // We NEVER want to run this code on the client side, because it will expose our credentials. But here it is fine becuase this code NEVER ends up in the client side.
    const client = await MongoClient.connect(
      //              username          password                      database name (meetups)
      "mongodb+srv://john-shepard:john1706@cluster0.fkbxa.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    // If the database name does not exist it will be created automatically
    const db = client.db();

    // A collection is like a table in SQL Database, since mongo is a noSQL
    // If collection (table) does not exist, will be created
    const meetupCollection = db.collection("meetups");

    // Insert-one is a command to insert a document (an entry) in the collection.
    const result = await meetupCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
};
export default handler;
