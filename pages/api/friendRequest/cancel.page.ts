import { FieldValue } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyIdToken, getFirebaseAdmin } from "next-firebase-auth";

import { initAuthentication } from "services/firebase/authentication";

initAuthentication();

// deleting a request from user.privateDb.friends__sentRequests
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) throw Error("Unauthorized");

    const authUser = await verifyIdToken(authToken);
    console.log("auth user id: ", authUser.id);
    if (!authUser.id) {
      console.log("authUser error");
      throw Error("Token incorrect");
    }

    const friendUID = req.body.friend;
    console.log("friend uid: ", friendUID);
    if (!friendUID) {
      console.log("friend uid error");
      throw Error("Friend not provided");
    }

    const db = getFirebaseAdmin().firestore();
    const docCollection = db.collection(`users/${authUser.id}/private`);
    const docRef = docCollection.doc("values");
    const docGet = (await docRef.get())?.data();

    const friendDocCollection = db.collection(`users/${friendUID}/private`);
    const friendDocRef = friendDocCollection.doc("values");
    const friendDocGet = (await friendDocRef.get())?.data();

    if (!(await db.collection("users").doc(friendUID).get()).data()) {
      console.log("friend data error");
      throw Error("Friend error");
    }

    if (
      !friendDocGet?.friends__receivedRequests.includes(authUser.id) ||
      !docGet?.friends__sentRequests.includes(friendUID)
    ) {
      console.log("request doesnt exist error");
      throw Error("Request doesn't exist");
    }

    await docRef.set(
      {
        friends__sentRequests: FieldValue.arrayRemove(friendUID),
      },
      { merge: true }
    );

    await friendDocRef.set(
      {
        friends__receivedRequests: FieldValue.arrayRemove(authUser.id),
      },
      { merge: true }
    );

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
