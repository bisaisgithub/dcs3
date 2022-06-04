import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res){

  // const client = await clientPromise
  // const mdb = client.db("myFirstDatabase")

  // const data = await mdb.collection("cdcsusers7").find({}).limit(10).toArray();

  // res.json({data})
  res.status(404);
}